
jQuery.fn.Countdown = function(userOptions){
    var defaultOptions={
        format: "dd:hh:mm:ss", //dd:hh:mm or hh:mm:ss
        endTime: "2016/12/24 23:59:59",  //any valid format that new Date() can accept
        step: 1000 //in million second
    };
    this.ele = this.get();
    this.interval = false;
    this.options = {};
    
    this.options = userOptions ? userOptions : defaultOptions;
    
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
        console.log(formatedDate);
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

        return this.setFormat(diffData);
    };
    this.diffTime = this.getDiffDate();
    this.update = function(){
        if(this.interval){
            window.clearTimeout(this.interval);
            return;
        }
        //this.update(this.getDiffDate());
        this.diffTime--;
        if( this.diffTime>0){
            this.interval = window.setTimeout(this.update(), this.options.step);
        }else if(this.diffTime == 0){
            this.stop();
        }

        //return this;
        this.ele.innerHTML = this.diffTime;
    };

    this.stop = function(){
        if(this.interval){
            window.clearTimeout(this.interval);
            this.interval = false;
        }
        return this;
    };

    // this.update = function(date){
    //     this.ele.innerHTML = date;
    // };

    this.update();
};
