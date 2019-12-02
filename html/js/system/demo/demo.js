
$(function(){
	// 初始化插件
	$("#demo").zyUpload({
		width            :   "100%",                 // 宽度
		height           :   "50px",                 // 宽度
		itemWidth        :   "30px",                 // 文件项的宽度
		itemHeight       :   "30px",                 // 文件项的高度
		//url              :   "/upload/UploadAction",  // 上传文件的路径
		url              :   "/?m=goods&c=association&a=orderImgUpload2",
		multiple         :   false,                    // 是否可以多个文件上传
		dragDrop         :   true,                    // 是否可以拖动上传文件
		del              :   true,                    // 是否可以删除文件
		finishDel        :   true,  				  // 是否在上传文件完成后删除预览
		/* 外部获得的回调接口 */
		onSelect: function(selectFiles, allFiles){    // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
			//console.info.info("当前选择了以下文件：");
			//console.info.info(selectFiles);
		},
		onProgress: function(file, loaded, total){    // 正在上传的进度的回调方法
			//console.info.info("当前正在上传此文件：");
			//console.info.info(file.name);
			//console.info.info("进度等信息如下：");
			//console.info.info(loaded);
			//console.info.info(total);
		},   
		onDelete: function(file, files){              // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
			//console.info.info("当前删除了此文件：");
			//console.info.info(file.name);
		},
		onSuccess: function(file, response){          // 文件上传成功的回调方法
			//console.info.info("此文件上传成功：");
			//console.info.info(file.name);
		},
		onFailure: function(file, response){          // 文件上传失败的回调方法
			//console.info.info("此文件上传失败：");
			//console.info.info(file.name);
		},
		onComplete: function(response){           	  // 上传完成的回调方法
			//console.info.info("文件上传完成");
			//console.info.info(response);
		}
	});
	
});

