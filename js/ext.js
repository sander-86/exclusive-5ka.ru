
$(document).ready(function(){
	var vote_id = parseInt($.cookie('vote_id')) || 0;
	var mask = parseInt($.cookie('mask')) || 0;
	var subscription = parseInt($.cookie('subscription')) || 0;

	//subscription = 0;
	//mask = 0;
	//vote_id = 0;

	console.log('vote: '+vote_id);
	console.log('mask: '+mask);
	console.log('subscription: '+subscription);

	if (vote_id > 0) {
		$(".vote__item[data-id!="+vote_id+"]").addClass("vote__item_disabled");

		$(".popup_1 .popup_tab").addClass("none");
		$(".popup_1 .steps_flex").removeClass("none");
	}

	$(".popup_2 .popup_mask_step_0").removeClass("none")

	if (subscription) {
		$(".vote__item").attr('data-window', 'popup_2');

		$(".popup_2 .popup_mask_step_0").addClass("none");
		$(".popup_2 .popup_mask_step_1").removeClass("none");

		$(".popup_2").removeClass("popup_1_sended");

	} else {
		$(".vote__item").attr('data-window', 'popup_1');
	}

	if (mask) {
		$(".popup_1 .popup_mask_step_1").addClass("none");
		$(".popup_1 .popup_mask_step_2").removeClass("none");

		$(".popup_2 .popup_mask_step_1").addClass("none");
		$(".popup_2 .popup_mask_step_2").removeClass("none");
	}

	$(".vote__item").click(function(){
		var id = $(this).attr('data-id');

		$(".to-vote").attr('data-vote', id);

		if (window.formSended == 1) {
			setTimeout(function(){
				$('.popup_1').addClass('popup_1_sended');
			}, 100);
		}
	});

	$(".to-vote").click(function(){
		var v = parseInt($(this).attr('data-vote')) || 0;

		$.cookie('vote_id', v, { expires: 7, path: '/' });
		$(".popup_1 .popup_tab").addClass("none");
		$(".popup_1 .steps_flex").removeClass("none");

		$(".vote__item[data-id!="+v+"]").addClass("vote__item_disabled");

		//console.log(v);
	});

	$(".to-share-vk, .to-share-fb").click(function(){
		$(".popup_1 .popup_mask_step_1").addClass("none");
		$(".popup_1 .popup_mask_step_2").removeClass("none");

		$(".popup_2 .popup_mask_step_1").addClass("none");
		$(".popup_2 .popup_mask_step_2").removeClass("none");

		$.cookie('mask', 1, { expires: 7, path: '/' });
	});

	$(".to-close-success-subscribe").click(function(){
		$('.popup_2').removeClass('popup_1_sended');
		$('.popup_2').removeClass('popup_2_sended');

		$(".popup_2 .popup_mask_step_0").addClass("none");
		$(".popup_2 .popup_mask_step_1").removeClass("none");

		if (mask) {
			$(".popup_2 .popup_mask_step_1").addClass("none");
			$(".popup_2 .popup_mask_step_2").removeClass("none");
		}

		$(".vote__item").attr('data-window', 'popup_2');

		return false;
	});

	var widget = new UWSPassportWidget({
		baseUrl: uwsBaseUrl,
		projectId: uwsProjectId
	});

	if(window.location.pathname.match(/\/email_confirm/)) {

		if (subscription) {
			location.href = '/';
			return;
		}

		var emailСonfirmCode = /email_confirm\/([^/]+)\/?$/.exec(window.location.href);

		if (emailСonfirmCode && emailСonfirmCode[1]) {

			console.log(emailСonfirmCode[1]);

			widget.confirmEmail({ code: emailСonfirmCode[1] }, function(res){

				$(".popup_2 .popup_mask_step_0").removeClass("none");
				$(".popup_2 .popup_mask_step_1").addClass("none");
				$(".popup_2 .popup_mask_step_2").addClass("none");
				$(".popup_2").addClass("open");

				setTimeout(function(){
					$('.popup_2').addClass('popup_2_sended');
				}, 100);

				$(".popup_2 .popup_mask_step_0 .popup_title").html("Подписка подтверждена!");
				$(".popup_2 .popup_mask_step_0 p").html("Мы&#160;сообщим тебе сразу, как только выйдет финальный эксклюзив от&#160;артистов");
				$(".to-close-success-subscribe").show();

				$.cookie('subscription', 1, { expires: 7, path: '/' });

			}, function(res) {

				$(".popup_2 .popup_mask_step_0").removeClass("none");
				$(".popup_2 .popup_mask_step_1").addClass("none");
				$(".popup_2 .popup_mask_step_2").addClass("none");
				$(".popup_2").addClass("open");

				setTimeout(function(){
					$('.popup_2').addClass('popup_2_sended');
				}, 100);

				$(".popup_2 .popup_mask_step_0 .popup_title").html("Ошибка");
				$(".popup_2 .popup_mask_step_0 p").html(res.message);
				$(".to-close-success-subscribe").hide();
			});
		}
	}
});
