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
       
        mrqe = function(cntrname, args) {
            this.that = cntrname;
            this.textWidth = $(this.that).textWidth();
            this.offset = $(this.that).width();
            this.width = this.offset;
            this.css = {
                    'text-indent' : $(this.that).css('text-indent'),
                    'overflow' : $(this.that).css('overflow'),
                    'white-space' : $(this.that).css('white-space')
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
                    speed: 1e1,
                    leftToRight: false,
                    pause: false,
                    loop: function() {}
                	}, 
                  args
                );
            this.i = 0;
            this.stop = this.textWidth*-1;
            this.dfd = $.Deferred();
            var me = this;
           
            this.go = function() {
                
                if($(me.that).css('overflow')!='hidden') {
                    $(me.that).css('text-indent', me.width + 'px'); 
                    console.log('dead1');
                    return false;
                }
                if(!$(me.that).length) {
                    console.log('dead2');
                		return me.dfd.reject();
                }
                if(me.width == me.stop) {
                    me.i++;
                    if(me.i == me.args.count) {
                        $(me.that).css(me.css);
				                console.log('dead3');
                        return me.dfd.resolve();
                    }
                    if(me.args.leftToRight) {
                        me.width = me.textWidth*-1;
                    } else {
                        me.width = me.offset;
                    }
                    me.reload();
                }
                $(me.that).css('text-indent', me.width + 'px');
                if (!me.args.pause) {
                  if(me.args.leftToRight) {
                      me.width++;
                  } else {
                      me.width--;
                  }
                }
                setTimeout(me.go, me.args.speed);
            };
            
            this.pause = function(state=2) {
            		if (state==2) {
                		me.args.pause = !me.args.pause;
                } else {
                		me.args.pause = !!state;
                }
            }
            
            this.play = function() {
            		me.i = 0;
            		me.width = me.offset;
            		me.args.pause = false;
                me.args.count = -1;
                
                if(me.args.leftToRight) {
                    me.width = me.textWidth*-1;
                    me.width++;
                    me.stop = me.offset;
                } else {
                    me.width--;            
                }
                $(me.that).css(me.marqueeCss);
                $(me.that).css('overflow', 'hidden');
                me.go();
                return me.dfd.promise();
            }
            
            this.reloadWidth = function() {
                me.textWidth = $(me.that).textWidth();
                me.stop = me.textWidth*-1;
            }
            
            this.load = function ( html ) {
            		$(me.that).html( html );
                me.reloadWidth();
            }
            
            this.reload = function() {
                me.args.loop();
                me.reloadWidth();
            }
            
            this.state = this.play();
        };
})(jQuery);
