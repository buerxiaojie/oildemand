function uploadimg(name){
	var $ = jQuery;
    // 优化retina, 在retina下这个值是2
    var ratio = window.devicePixelRatio || 1;
    // 缩略图大小
    var thumbnailWidth = 100 * ratio;
    var thumbnailHeight = 70 * ratio;
    var fcount=0;
    // Web Uploader实例
    var uploader;

    // 初始化Web Uploader
    uploader = WebUploader.create({

        // 自动上传。
        auto: true,

        // swf文件路径
        swf: '/js/Uploader.swf',

        // 文件接收服务端。
        server: '/front/common/o_webuploader.do',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker_'+name,

        // 只允许选择文件，可选。
        accept: {
            title: '只能选择图片文件',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
		
		disableGlobalDnd: true,

        chunked: true,
        thumb:{
            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 100,
            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: true,
            // 是否允许裁剪。
            crop: true
        },

        fileNumLimit: 2,
        fileSizeLimit: 20 * 1024 * 1024,  // 20 M
        fileSingleSizeLimit: 10 * 1024 * 1024    // 5 M
	});
    
    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {

        var $list = $('#fileList_'+name);
        var $li = $(
		
		'<div id="' + file.id + '" class="file-item thumbnail">' + '<img>' + '<i class="remove-this"></i>' + '</div>'
			
		),
		
		$img = $li.find('img');
		
		$list.find(".img-demo").hide();
		
        $list.append( $li );

        // 创建缩略图
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
        
        $li.on('click', '.remove-this', function(e) {
        	var fileId=$(this).closest("div").attr("id");
        	var _file=uploader.getFile(fileId);
            uploader.removeFile(_file, true);
            $(this).closest("div").remove();
            fcount--;
            if(fcount<=0){
        		$list.find(".img-demo").show();
        		fcount=0;
            }
        });
        fcount++;
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                    .appendTo( $li )
                    .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file,response ) {
    	var _curE=$( '#'+file.id );
    	_curE.addClass('upload-state-done');
        var result=eval("("+response._raw+")");
        if (200==result.code) {
            //console.info(result.path);
           // _curE.find("img").attr("src","/res/upload"+result.path);
        	_curE.append('<input type="hidden" name="'+name+'" value="'+result.path+'" />');
		}else{
			//删除客户端图片
			$( '#'+file.id ).find(".remove-this").click();
			//提示
			alert(result.msg);
		}
    });

    // 文件上传失败，现实上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });
    // 上传错误时触发
    uploader.on( 'error', function( type ) {
        if("Q_EXCEED_NUM_LIMIT"==type){
        	alert("图片上传个数超出限制！");
        }else if("Q_TYPE_DENIED"==type){
        	alert("图片格式不正确！");
        }else if("F_DUPLICATE"==type){
        	alert("该图片已经上传！");
        }else{
        	alert(type);
        }
    });
}