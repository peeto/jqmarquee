(function($) {
    $.fn.textWidth = function() {
        var width = 0;
        var calc = '<span style="display: block; width: 100%; overflow-y: scroll; white-space: nowrap;" class="textwidth"><span>' + $(this).html() + '</span></span>';
        $('body').append(calc);
        var last = $('body').find('span.textwidth:last');
        if (last) {
            var lastcontent = last.find('span');
            width = lastcontent.width();
            last.remove();
        }
        return width;
    };
       
    mrqe = function(selector, args) {
        this.selector = selector;
        var me = this;
        this.textWidth = $(this.selector).textWidth();
        this.offset = $(this.selector).width();
        this.i = 0;
        this.dfd = $.Deferred();
        
        this.setWidth = function () {
            if (me.args && me.args.leftToRight) {
                me.width = me.textWidth*-1;
                me.stop = me.offset;
            } else {
                me.width = me.offset;
                me.stop = me.textWidth*-1;
            }
        }
        
        this.setWidth();
        this.css = {
            'text-indent' : $(this.selector).css('text-indent'),
            'overflow' : $(this.selector).css('overflow'),
            'white-space' : $(this.selector).css('white-space')
        }
        this.marqueeCss = {
            'text-indent' : this.width,
            'overflow' : 'hidden',
            'white-space' : 'nowrap'
        }
        this.args = $.extend(
            true,
            {
                count: -1,
                speed: 1,
                cpudelay: 4,
                cpuspeedratio: 5,
                leftToRight: false,
                pause: false,
                loop: function() {},
                start: function() {
                    me.play();
                },
                end: function() {}
            }, 
            args
        );
           
        this.go = function() {
                
            if ($(me.selector).css('overflow')!='hidden') {
                $(me.selector).css('text-indent', me.width + 'px'); 
                // missing css
                return false;
            }
            if (!$(me.selector).length) {
                // no content
                return me.dfd.reject();
            }
            
            if (
                (me.args && me.args.leftToRight && me.width >= me.stop) ||
                ((!me.args || !me.args.leftToRight) && me.width <= me.stop)
            ) {
                me.i++;
                if (me.i == me.args.count) {
                    // completed
                    me.args.end();
                    return me.dfd.resolve();
                }
                me.rewind();
                me.reload();
            }
            $(me.selector).css('text-indent', me.width + 'px');
            if (!me.args.pause) {
                if (me.args.leftToRight) {
                    me.width += (me.args.speed * me.args.cpudelay / me.args.cpuspeedratio);
                } else {
                    me.width -= (me.args.speed * me.args.cpudelay / me.args.cpuspeedratio);
                }
            }
            setTimeout(me.go, me.args.cpudelay);
        };
            
        this.pause = function(state=2) {
            if (state==2) {
                me.args.pause = !me.args.pause;
            } else {
                me.args.pause = !!state;
            }
        }
            
        this.rewind = function() {
            me.setWidth();
        }
            
        this.play = function() {
            me.i = 0;
            me.rewind();
            me.args.pause = false;
                
            $(me.selector).css(me.marqueeCss);
            $(me.selector).css('overflow', 'hidden');
            me.go();
            return me.dfd.promise();
        }
            
        this.start = function() {
            if (me.args && me.args.start) {
                me.args.start();
            } else {
                me.play();
            }
        }
                
        this.reloadWidth = function() {
            me.textWidth = $(me.selector).textWidth();
            me.offset = $(me.selector).width();
            me.setWidth();
        }
        
        this.load = function ( html ) {
            $(me.selector).html( html );
            me.reloadWidth();
        }
            
        this.reload = function() {
            me.args.loop();
            me.reloadWidth();
        }

        this.speed = function(speed=false) {
            if (speed===false) {
                return me.args.speed;
            } else {
                me.args.speed = speed;
            }
        }
        
        this.state = this.start();
    };

})(jQuery);
