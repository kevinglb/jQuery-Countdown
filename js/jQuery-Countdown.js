var NAME = 'Countdown';
var DATA_ATTR = 'date';
var Countdown = function(ele, userOptions){
    var defaultOptions={
        format: "dd:hh:mm:ss", //dd:hh:mm or hh:mm:ss
        endTime: "2016/12/24 23:59:59",  //any valid format that new Date() can accept
        step: 1000 //in million second
    };
    this.ele = ele;
    this.interval = false;
    this.options = {};
    
    this.options = userOptions ? userOptions : defaultOptions;
    this.started = false;
    // merge default options and options into this.options
    for(var obj in defaultOptions){
        if(defaultOptions.hasOwnProperty(obj)){
            this.options[obj] = (typeof this.options[obj] !== 'undefined') ? this.options[obj]:defaultOptions[obj];
            if(obj === 'endTime' && typeof(this.options.endTime) !== 'object'){
                this.options.endTime = new Date(this.options.endTime);
            }

            if(typeof this.options[obj] ==="function"){
                this.options[obj] = this.options[obj].bind(this);
            }
        }
    }


    this.setFormat = function(data){
        var formatedDate = "";
        var format = this.options.format.split(":");
        for(var i =0;i<format.length;i++){
            switch(format[i].toLowerCase()){
                case "dd":
                    formatedDate += data.Day < 10 ? '0'+data.Day:data.Day;
                    formatedDate += ":";
                    break;
                case "hh":
                    formatedDate += data.Hour < 10 ? '0' + data.Hour : data.Hour;
                    formatedDate += ":";
                    break;
                case "mm":
                    formatedDate += data.Min < 10 ? '0' + data.Min : data.Min;
                    formatedDate += ":";
                    break;
                case "ss":
                    formatedDate += data.Sec < 10 ? '0' + data.Sec : data.Sec;
                    break;
                default:
                    break;
            }
        }
        //console.log(formatedDate);
        return formatedDate;
    };

    this.getDiffDate = function(){
        var diffData = {
            Day: 0,
            Hour: 0,
            Min: 0,
            Sec: 0
        };

        var diff = (new Date(this.options.endTime) - Date.now())/1000;  //diff time in seconds
        if(diff <= 0 ){
            if(this.interval){
                this.started = false;
                this.stop();
                // this.options.onEnd();
            }
            return this.setFormat(diffData);
        }

        diffData.Day = Math.floor(diff / 86400);
        diffData.Hour = Math.floor((diff % 86400) / 3600);
        diffData.Min = Math.floor((diff % 3600) / 60);
        diffData.Sec = Math.floor((diff % 3600) % 60);
        console.log(diffData);
        var diffDate = this.setFormat(diffData);
        return diffDate;
    };
   
    this.update = function(){
        if(this.interval){
            window.clearInterval(this.interval);
            //return;
        }
        //this.started = true;
        //this.update(this.getDiffDate());
        
            this.interval = window.setInterval(this.update, 1000);
        
        //console.log(this.diffTime);
        //return this;
        this.ele.innerHTML = this.getDiffDate();
    }.bind(this);

    this.stop = function(){
        if(this.interval){
            window.clearInterval(this.interval);
            this.interval = false;
        }
        return this;
    }.bind(this);

    // this.update = function(date){
    //     this.ele.innerHTML = date;
    // };

    this.update();
};


jQuery.fn.Countdown = function(options) {
  return $.each(this, function(i, el) {
    var $el = $(el);
    if (!$el.data(NAME)) {
      // allow setting the date via the data-date attribute
      if ($el.data(DATA_ATTR)) {
        options.date = $el.data(DATA_ATTR);
      }
      $el.data(NAME, new Countdown(el, options));
    }
  });
};
