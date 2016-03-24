// var NAME = 'Countdown';
// var DATA_ATTR = 'date';
var Countdown = function(ele, userOptions){
    this.ele = ele;
    this.options = {};
    this.userOptions = userOptions;
    this.interval = false;
    this.started = false;
    this.init = function(){
        var defaultOptions={
            format: "dd:hh:mm:ss", //dd:hh:mm or hh:mm:ss
            endTime: "2016/12/24 23:59:59",  //any valid format that new Date() can accept
            step: 1000 //in million second
        };
        // merge default options and options into this.options
        //fill the options value with defaul ones if it is not given in userOptions
        for(var obj in defaultOptions){
            if(defaultOptions.hasOwnProperty(obj)){
                this.options[obj] = (typeof this.userOptions[obj] !== 'undefined') ? this.userOptions[obj]:defaultOptions[obj];
                if(obj === 'endTime' && typeof(this.options.endTime) !== 'object'){
                    this.options.endTime = new Date(this.options.endTime);
                }
                if(typeof this.options[obj] ==="function"){
                    this.options[obj] = this.options[obj].bind(this);
                }
            }
            //console.log(this.options);
        }
        this.diff = (new Date(this.options.endTime) - Date.now())/1000; //get the difference time in seconds 
        this.update();
    };

    this.setFormat = function(data){
        var formatedDate = [];
        var format = this.options.format.split(":");
        for(var i =0;i<format.length;i++){
            switch(format[i].toLowerCase()){
                case "dd":
                    formatedDate.push(data.Day < 10 ? '0'+data.Day:data.Day);
                   
                    break;
                case "hh":
                    formatedDate.push(data.Hour < 10 ? '0' + data.Hour : data.Hour);

                    break;
                case "mm":
                    formatedDate.push(data.Min < 10 ? '0' + data.Min : data.Min);

                    break;
                case "ss":
                    formatedDate.push(data.Sec < 10 ? '0' + data.Sec : data.Sec);
                    break;
                default:
                    break;
            }
        }
       
        return formatedDate.join(":");
    };

    this.getDiffDate = function(){
        var diffData = {
            Day: 0,
            Hour: 0,
            Min: 0,
            Sec: 0
        };
        if(this.diff === 0 ){
            if(this.interval){
                this.stop();
            }
            return this.setFormat(diffData);
        }

        diffData.Day = Math.floor(this.diff / 86400);
        diffData.Hour = Math.floor((this.diff % 86400) / 3600);
        diffData.Min = Math.floor((this.diff % 3600) / 60);
        diffData.Sec = Math.floor((this.diff % 3600) % 60);
        this.diff --;

        return this.setFormat(diffData);
    };
   
    this.update = function(){
        if(this.interval){
            window.clearTimeout(this.interval);
            //return;
        }
        if(this.options.step){
            this.interval = window.setTimeout(this.update, this.options.step);
        }else{
            this.interval = window.setTimeout(this.update, 1000);
        }    
        this.ele.innerHTML = this.getDiffDate();
    }.bind(this);

    this.stop = function(){
        if(this.interval){
            window.clearTimeout(this.interval);
            this.interval = false;
        }
        return this;
    }.bind(this);

    this.init();
};


jQuery.fn.Countdown = function(options) {
  return $.each(this, function(i, el) {
    var $el = $(el);
    $el.data(new Countdown(el, options));
    // if (!$el.data(NAME)) {
    //   // allow setting the date via the data-date attribute
    //   if ($el.data(DATA_ATTR)) {
    //     options.date = $el.data(DATA_ATTR);
    //   }
      
    // }
  });
};
