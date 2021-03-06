 /*
 * board.js for BoardDX
 * @author phiDel (xe.phidel@gmail.com, https://github.com/phiDelbak/Board-DX-for-XE)
 */

jQuery(function($)
{
	String.prototype.pidUcfirst = function()
	{
		var s=this;return s.charAt(0).toUpperCase() + s.slice(1);
	};

	$('a[href=#siManageBtn]')
	.click(function()
	{
		$('.scElps ._first').each(function(){$(this).css('width', ($(this).width() - 30) + 'px');});
		$('.scCheck').show('slow');

		var $a = $(this).next();

		$('select', $a).change(function() {
			var v = $(this).val() || '', s = [];
			$('input[name=cart]:checked').each(function(i) { s[i] = $(this).val(); });
			if(s.length<1) return alert('Please select the items.', this) || false;
			exec_json('beluxe.procBeluxeChangeCustomStatus', {mid:current_mid,new_value:v,target_srls:s.join(',')}, completeCallModuleAction);
			return;
		});

		$('a[data-type]', $a).click(function() {
			switch($(this).attr('data-type')) {
				case 'manage':popopen(request_uri+'?module=document&act=dispDocumentManageDocument','manageDocument');break;
				case 'admin': location.href = current_url.setQuery('act','dispBeluxeAdminModuleInfo');
			}
			return false;
		});

		$a.show('slow');
		$(this).hide().prevAll().hide();
		return false;
	});

	$('#siCat.tabn,#siCat.colm')
	.each(function()
	{
		var $i = $(this), iscolm = $i.hasClass('colm'), $u = $('ul', this), $a = $('li.active:last', this),
			dt = parseInt($u.css("margin-top")) || 0, uh = parseInt($u.height()) - dt,
			lh = parseInt($('li:first', this).height()) + parseInt($('li:first', this).css('margin-bottom'));

		// 선택된 분류가 있으면 위치 구하고 이동
		var nn = parseInt(($a.position($i) ? $a.position($i).top : 0) / lh);
		if(nn > 0) $u.css('margin-top', ((nn * lh) * -1)  + 'px');

		if(lh >= uh)
		{
			$('.scCaNavi',this).css('display','none');
			$u.css('margin-right',iscolm ? '18px' : '0');
		}
		else
		{
			$('.scCaNavi a:eq(0)',this).click(function(){
				var t = parseInt($u.css("margin-top"));
				if(t < dt) $u.css('margin-top', (t + lh + dt) + 'px');
				return false;
			});
			$('.scCaNavi a:eq(1)',this).click(function(){
				var t = parseInt($u.css("margin-top"));
				if((t - lh - dt) > -uh) $u.css('margin-top', (t - lh - dt) + 'px');
				return false;
			});
		}

		if(iscolm)
		{
			var $p = $('#siLst:not(.noheader):eq(0), #siHrm:not(.noheader):eq(0)'),
				$k = $('.scCaLock',this), cok = getCookie('scCaLock');

			if(!$p.length) return;
			if($p.length>1) $p = $($p.get(0));

			// 초반에 크기를 구하기 위해 visibility:hidden 사용했기에 숨기고 다시 켠다.
			$i.css({'display':'none','visibility':'visible'});
			$i.css({'top':$p.position().top+'px','width':$p.width()-10+'px'});

			$i.on('fadeIn.fast', function(){
				$(this).css({'top':$p.position().top+'px','width':$p.width()-10+'px'}).fadeIn('fast');
			}).on('fadeOut.fast', function(){
				$i.fadeOut();
			});

			if($k){
				$k.click(function() {
					if($(this).hasClass('active')){
						$(this).removeClass('active');
						setCookie('scCaLock','hide',null,'/');
					} else {
						$(this).addClass('active');
						setCookie('scCaLock','',null,'/');
					}
					return false;
				});
				if(cok=='hide') $k.removeClass('active');
			}

			if($i.attr('data-autohide') == 'true'){
				$('thead tr:first th:not(.sort), ul.scFrm:first', $p).mouseenter(function(e){
					var te = e.target, $isSp = $('> span.sort:eq(0)',te);
					if($isSp.length && (e.offsetX > $isSp.position().left)) return;
					$i.trigger('fadeIn.fast');
				});
				$(document).mousemove(function(e){
					var te = e.target;
					if ($(te).parents().add(te).index($i) > -1) return;
					if(!$i.is(':hidden')&&$i.css('opacity')=='1'&&!$k.hasClass('active')) $i.fadeOut();
				});
			}
		}
	});

	$('#siLst.gall .scInfo[data-autohide=true]')
	.each(function()
	{
		var $i = $(this),$p = $i.closest('.scItem'), $n = $('.nick_name',this),
			$m = $i.prev('span.prtImg'), fade = $i.attr('data-fade') == 'true';

		$p.mouseenter(function(e)
		{
			$m.hide('slow');
			if(fade) $i.fadeIn('slow'); else $i.slideDown();
			$n.show('slow');
		}).mouseleave(function(e)
		{
			$n.hide('slow');
			if(fade) $i.fadeOut(); else $i.slideUp();
			$m.show('slow');
		});
	});

	$('.scSns a')
	.click(function()
	{
		var $o = $('#siHrm li.scElps strong:eq(0)'), v, t = $(this).attr('data-type'),
			co = encodeURIComponent($o.text().trim()), rl = encodeURIComponent($o.attr('title'));
		switch(t)
		{
			case 'fa': v = 'http://www.facebook.com/share.php?t=' + co + '&u=' + rl; break;
			case 'de': v = 'http://www.delicious.com/save?v=5&noui&jump=close&url=' + rl + '&title=' + co; break;
			default: v = 'http://twitter.com/home?status=' + co + ' ' + rl; break;
		}
		popopen(v, '_pop_sns');
		return false;
	});

	$('a[href=#popopen][data-srl]')
	.click(function()
	{
		var srl = $(this).attr('data-srl') || '';
		if(srl) popopen(srl.setQuery('is_poped','1'),'beluxePopup');
		return false;
	});

	$('a[href=#tbk_action][class=delete]')
	.click(function()
	{
		if(!confirm('Do you want to delete the selected trackback?')) return false;
		var srl = $(this).closest('li').find('a[name^=trackback_]').attr('name').replace(/.*_/g,'');
		exec_json('beluxe.procBeluxeDeleteTrackback', {mid:current_mid,trackback_srl:srl}, completeCallModuleAction);
		return false;
	});

	$('a[href=#his_action][data-mode=delete][data-srl]')
	.click(function()
	{
		if(!confirm('Do you want to delete the selected history?')) return false;
		var srl = $(this).attr('data-srl') || 0,doc = $(this).attr('data-doc') || 0;
		exec_json('beluxe.procBeluxeDeleteHistory', {mid:current_mid,history_srl:srl,document_srl:doc}, completeCallModuleAction);
		return false;
	});

	$('a[href^=#][href$=recommend][data-type]')
	.click(function()
	{
		var $i = $(this), hr = $i.attr('href'), ty = $i.attr('data-type'), srl = $i.attr('data-srl');
		var params = {target_srl : srl, cur_mid : current_mid, mid : current_mid};

		exec_json(
			ty + '.proc' + ty.pidUcfirst() + (hr == '#recommend' ? 'VoteUp' : 'VoteDown'),
			params,
			function(ret_obj) {
				alert(ret_obj.message);
				if(ret_obj.error === 0)
				{
					var $e = $i.find('em.cnt');
					$e.text((parseInt($e.text()) || 0) + (hr == '#recommend' ? 1 : -1));
				}
			}
		);
		return false;
	});

	$('a[href=#declare][data-type]')
	.click(function()
	{
		var $i = $(this), ty = $i.attr('data-type'), srl = $i.attr('data-srl'),
			c, tmp, rec = $i.attr('data-rec') || '0';

		c = prompt(_DXS_MSGS_.declare, '');
		// 브라우저에서 블럭 옵션이 떠서 다른 방법 씀
	    //if(typeof c != 'string' || !c.trim()) return alert(_DXS_MSGS_.canceled) || false;
		if(typeof c != 'string')  return false;
		if(!c.trim())
		{
			tmp = $('<div class="dxc_minimsg">').html('Please enter the message.');
			$i.parent().after(tmp);
			tmp.delay(3000).fadeOut(2500, function() {$(this).remove();});
			return false;
		}
		exec_json(
			ty + '.proc' + ty.pidUcfirst() + 'Declare',
			{target_srl: srl, cur_mid: current_mid, mid: current_mid},
			function(ret_obj) {
				alert(ret_obj.message);
				if(ret_obj.error === 0 && rec != '0')
				{
					var t = '[Board DX] Declare, received messages: ' + srl,
						u = current_url.setQuery('comment_srl',(ty=='comment'?srl:''));
						c = c + '<br /><br /><a href="' + u + '">'+u+'</a>';
					exec_json('communication.procCommunicationSendMessage',
						{receiver_srl: rec, title: t, content: c},
						function(ret_obj2) {
							if(ret_obj2.error !== 0) alert(ret_obj2.message);
						}
					);
				}
			}
		);

		return false;
	});

	$('.btnAdopt button[data-adopt-srl]')
	.click(function()
	{
		var $i = $(this), c, srl = $i.attr('data-adopt-srl') || '', name = $i.attr('data-adopt-name') || '';

		c = prompt('Send thanks message to ' + name, '');
		// 브라우저에서 블럭 옵션이 떠서 다른 방법 씀
		// if(typeof c != 'string' || !c.trim()) return alert(_DXS_MSGS_.canceled) || false;
		if(typeof c != 'string')  return false;
		if(!c.trim())
		{
			tmp = $('<div class="dxc_minimsg">').html('Please enter the message.');
			$i.parent().after(tmp);
			tmp.delay(3000).fadeOut(2500, function() {$(this).remove();});
			return false;
		}
		exec_json(
			'beluxe.procBeluxeAdoptComment',
			{comment_srl: srl, send_message: c},
			function(ret_obj) {
				alert(ret_obj.message);
				if(ret_obj.error === 0)
				{
					location.reload();
				}
			}
		);

		return false;
	});

	$('#siFbk .scFbWt form textarea[name=content]')
	.focus(function()
	{
		$('.scWusr', $(this).closest('form')).show('slow');
	});

	$('.scHLink[data-href]')
	.click(function()
	{
		window.open($(this).attr('data-href'), ($(this).attr('data-target') || ''));
		return false;
	});

	$('.scToggle[data-target]')
	.click(function()
	{
		$($(this).attr('data-target')).slideToggle();
		return false;
	});

	$('.scClipboard')
	.click(function()
	{
		var tg = $(this).attr('data-attr') || false;
		prompt('press CTRL+C copy it to clipboard...', (tg ? $(this).attr(tg) : $(this).text()));
		return false;
	});

	// 글쓰기
	$.fn.pidSettingWrite = function()
	{
		$('.scWcateList', this).change(function(){
			var v = $(this).val(), k = $(this).data('key'),
				$d = $('.scWcateList[data-key='+k+']').hide('slow'),
				$s = $('.scWcateList[data-key='+v+']');
			$(this).data('key', v);
			$('input:hidden[name=category_srl]').val(v);
			$('.scWcateList[data-key='+$d.data('key')+']').hide('slow');
			if($s.find('>option').length) $s.change().show('slow');
		});
		$('input:hidden[name=category_srl]:eq(0)', this).each(function(){
			var v = $(this).val() || 0, j, i = 0, $s;
			if(v > 0){
				for(j=0;j<3;j++) {
					$s = $('.scWcateList option[value='+v+']').closest('select').val(v).data('key', v).change();
					if(!$s||!$s.attr('data-key')) break;
					v = $s.show('slow').attr('data-key');
				}
			}else{
				$('.scWcateList:eq(0)').change();
			}
		});
		$('.scWul.extraKeys >li:hidden:eq(0)', this).each(function(){
			$('#siWrt .scExTog:hidden').show().click(function(){
				$('#siWrt .scWul.extraKeys >li:hidden').show('slow');
				$(this).hide();
				return false;
			});
		});
		$('a[href=#insert_filelink]', this).click(function(){
			var $p = $(this).closest('#insert_filelink').find('> input'),
				v = $p.val(), q = $(this).attr('data-seq'), r = $(this).attr('data-srl');
			if(v === undefined || !v){
				alert('Please enter the file url.\nvirtual type example: http://... #.mov');
				$p.focus();
				return false;
			}
			exec_json(
				'beluxe.procBeluxeInsertFileLink',
				{ 'mid':current_mid,'sequence_srl':q,'document_srl':r,'filelink_url':v },
				function(ret){
					// ckeditor
					if($('[id^=ckeditor_instance_]').length) {
						var u = xe.getApp('xeuploader');
						if(u.length===1) u[0].loadFilelist();
						else u = $('#xefu-container-'+ret.sequence_srl).xeUploader();
					// xpresseditor
					}else if($('.xpress-editor').length){
						reloadFileList(uploaderSettings[ret.sequence_srl]);
					}
				}
			);
			return false;
		});
		$('input[name=category_srl]').focusin(function(){console.log(this);});
	};

	// check iframe
	try{
		var $frm = $(window.frameElement), $mod, m_par, m_doc;
		if($frm.is('[id=pidOframe]'))
		{
        	m_par = $frm.closest('html');
        	m_doc = $('body', $frm[0].contentDocument || $frm[0].contentWindow.document);

        	$mod = $frm.parent().parent();
        	$('.pid_modal-head:eq(0)', $mod).each(function()
        	{
        		var $pidtmp = $('#__PID_MODAL_HEADER__', m_doc||'');
				if($pidtmp.length) {
					$(this).html('<div>' + $pidtmp.html() + '</div>').show();
					$pidtmp.remove();
				}
			});
        	$('.pid_modal-foot:eq(0)', $mod).each(function()
        	{
        		var $pidtmp = $('#__PID_MODAL_FOOTER__', m_doc||'');
				if($pidtmp.length) {
					$(this).html('<div>' + $pidtmp.html() + '</div>').show();
					$pidtmp.remove();
				}
			});

			// $('#siCat li.scVMdCmt a', m_doc||'')
			// .click(function()
			// {
			// 	var $this = $(this),
			// 		doc_srl = current_url.getQuery('document_srl'),
			// 		cpage = current_url.getQuery('cpage'),
			// 		is_modal = current_url.getQuery('is_modal');

			// 	exec_json(
			// 		'beluxe.getBeluxeTemplateFile',
			// 		{ 'mid':current_mid,'document_srl':doc_srl,'cpage':cpage,'is_modal':is_modal,'template_file':'comment' },
			// 		function(ret){
			// 			var $cmt = $('#siCmt', m_doc||'');
			// 			if($cmt.length){
			// 				$('#siDoc,#siTrb', m_doc||'').hide();
			// 				$cmt.html(ret.html).show('slow');
			// 				$('li.scVMdTrb,li.scVMdDoc',$this.parent().parent()).removeClass('active');
			// 				$('li.scVMdCmt',$this.parent().parent()).addClass('active');
			// 			}
			// 		}
			// 	);

			// 	return false;
			// });

			// $('#siCat li.scVMdDoc a', m_doc||'')
			// .click(function()
			// {
			// 	$('#siCmt,#siTrb', m_doc||'').hide();
			// 	$('#siDoc', m_doc||'').show('slow');
			// 	$('li.scVMdTrb,li.scVMdCmt',$(this).parent().parent()).removeClass('active');
			// 	$('li.scVMdDoc',$(this).parent().parent()).addClass('active');

			// 	return false;
			// });
		}
	}catch(e){}

	$(window)
	.ready(function()
	{
		$('a[type^=example\\/modal]')
		// .on('after-open.mw', function(e, frm)
		// {
		// 	console.log(frm);
		// })
		.pidModalWindow(m_par||'', true);

		$('#siWrt:eq(0)').pidSettingWrite();
		$('div[data-flash-fix=true]').pidModalFlashFix();
		$('div[data-link-fix=true]').each(function(){
			$('a:not([target])',this).attr('target','_blank');
		});
		if(getCookie('scCaLock')!='hide') $('#siCat.colm').trigger('fadeIn.fast');
	})
	.load(function()
	{
		// 모바일 사용안할때 크기가 너무 줄어들면 조절
		// 모바일 사용안하는 특정상황에만 필요한 경우라 onresize에선 처리안함
		$('table#siLst').each(function()
		{
			var $th =$(this), ww = $('#siBody').parent().width(),
				tr = /*$th.position().left + */$th.outerWidth();
			if(ww < tr){
				var ta = $('tr:eq(0) th.title', $th).outerWidth() || 150;
					tt = Math.floor((tr-ww+ta) / ($('tr:eq(0) th', $th).length - 3));
				if(!ta || ta>130) return;
				$('th, td', $th).each(function(e) {
					var $i = $(this);
					if($i.is('.title')) return;
					var j = $i.width() - tt;
					$i.css({'max-width': j>0?j:1});
				});
			}
		});
		$('#siFbk .scFbH + .scClst > .scFrm').each(function()
		{
			var $th =$(this), tw = $th.outerWidth();
			if(tw < 400) {
				$('.scFbt', $th).css('width','auto');
				$('.scCmtCon', $th).css('margin-left','5px');
			}
		});

		// 제목 자동조절
		$('.scElps[data-active=true]')
		.each(function(e)
		{
			var $i = $(this), $f = $('> :eq(0)', $i),$l = $('> :eq(1)', $i),fw = $i.width(),lw = 0;
			if($l.length)
			{
				if($('> img', $l).length || $l.text().trim())
					lw = $l.addClass('_last').outerWidth(true);
				else $l.remove();
			}
			$f.css('width',(fw - lw - 5) + 'px').addClass('_first');
		});

		// 핫트랙
		$('.scContent [data-hottrack]')
		.each(function(e)
		{
			var $i = $(this), tp = $i.attr('data-type'), ur = $i.attr('data-hottrack'),
				$a = $('<a class="scHotTrack">').attr('href', ur),
				w = $i.outerWidth(tp !== 'gall') - (tp === 'widg' ? 7 : 4);

			if($i.get(0).tagName=='TR') {
				$i.find('>td:eq(0)').is(function(){
					$a.prependTo(this).width(w);
					if(tp === 'lstc') $a.height($i.outerHeight()+$i.next().outerHeight());
				});
			}
			else $a.prependTo(this).width(w);

			// 모달 보기 사용시
			if($i.is('[data-modal-key]')){
				$a.attr({'type':'example/modal','data-footer':'__PID_MODAL_FOOTER__','data-header':'__PID_MODAL_HEADER__'}).pidModalWindow(m_par||'');
			}
		});

		$('#siFbk a[name^=comment][data-scroll=true]:last', m_doc||'').is(function(){this.scrollIntoView(true);});

		// ie10 이하 클릭(커서) 버그 방지, 다른 브라우저도 나쁘지 않아 적용
		$('.pid_ajax-form input:text:eq(0)').focus();
	});
});
