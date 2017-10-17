/**
 * 组件：上传按钮组件
 * 说明：封装了Plupload组件
 * 作者：xiexb
 * 日期： 2015-05-26
 */

//实例化一个plupload上传对象
function UploadButton (options) {
	var defineOptions ={
		browse_button : 'upButton',
	    runtimes : 'html5,flash,html4',
	    url : '',
	    flash_swf_url : '../../plugin/plupload/js/Moxie.swf',
	    multi_selection:false,
	    max_file_size: '100mb',
	    mime_types: null,
	    autoCompleteFile : false,
	    events: {
		    fileAdded: null,
		    fileUploaded: null,
		    uploadProgress: null,
		    uploadComplete: null,
		    error:  null	    	
	    }
	};
	
	options = $.extend(true, defineOptions,  options);
	
	var uploader = new plupload.Uploader({
		browse_button : options.browse_button,
	    runtimes : options.runtimes,
	    resize : { width : 200, height : 200, quality : 90 ,crop: true },
	    url : options.url,
	    flash_swf_url : options.flash_swf_url,
        multi_selection: options.multi_selection,
        filters : {
            max_file_size : options.max_file_size,
            mime_types: options.mime_types
        }
	});
	  
	uploader.init();
	
	if(options.autoCompleteFile){
		//绑定各种事件，并在事件监听函数中做你想做的事
		uploader.bind('FilesAdded',function(uploader,files){
			if (options.events.filesAdded != null){
				options.events.filesAdded()
			}
			if(options.beforeFileUpLoad != null){
				options.beforeFileUpLoad;
			}
		    uploader.start();
		});
	}
	  
	uploader.bind('UploadProgress',function(uploader,file){
		if (options.events.uploadProgress != null){
			options.events.uploadProgress(uploader,file)
		}
	});
	
	uploader.bind('FilesAdded',function(uploader,file){
		if (options.events.FilesAdded != null){
			options.events.FilesAdded(uploader,file)
		}
	});
	  
	uploader.bind('FileUploaded',function(uploader,file, info){
		if (options.events.fileUploaded  != null){
			options.events.fileUploaded(uploader,file, info)
		}
	});
	  
	uploader.bind('UploadComplete',function(uploader,file,info){
		if (options.events.uploadComplete  != null){
			options.events.uploadComplete(uploader,file)
		}	
	});
	
	uploader.bind('Error',function(up, args){
		alertMsg("错误:[" + args.code + "]" + args.message);
	});
	return uploader;
}
