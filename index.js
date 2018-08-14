$(document).ready(function () {
    var slider = $("input[type='range']");
    slider.val(0);
    var total_duration = 0;
    var audio = $("audio");

    function playAudioWithTime(time, item) {
        item.currentTime = time;
        item.play();
    }
    function activeBox(id) {
        $("i").parent().css('background', 'white');
        $("i[data-audio=" + id + "]").parent().css('background', 'red');
    }
    function hideButton(name) {
        $(name).removeClass('d-block');
        $(name).addClass('d-none');
    }
    function showButton(name) {
        $(name).removeClass('d-none');
        $(name).addClass('d-block');
    }
    function stopAudio(item) {
        item.pause();
        item.currentTime = 0;
    }
    function playAudioById(id) {
        $("#" + id)[0].play();
    }


    audio.each(function (index, item) {
        item.onloadedmetadata = function() {
            total_duration += item.duration;
            slider.attr('max', total_duration);
        }
        item.ontimeupdate = function() {
            var time = 0;
            audio.each( function (key, value) {
                if(key >= index) {
                    return;
                }
                time += value.duration;
            })
            slider.val(item.currentTime + time);
        }
        item.addEventListener('ended', function () {
            if(index < audio.length) {
                audio[index + 1].play();
                activeBox(audio[index + 1].id);
            }
        })
    });
    slider.on('change', function () {
        var current_time = $(this).val();
        audio.each(function (index, item) {
            // item.pause();
            var duration = 0;
            audio.each(function (key, value) {
                if(key < index) {
                    duration += value.duration;
                }
            })
            stopAudio(item);
            if(duration < current_time && item.duration + duration > current_time){
                activeBox(item.id);
                playAudioWithTime(current_time - duration, item);
            }
        })
    })
    $(".fa-volume-off").on('click', function() {
        hideButton(".fa-volume-up");
        showButton(".fa-volume-off");
        audio.each(function (index, item) {
            stopAudio(item);
        })
        var audio_target = $(this).attr("data-audio");
        activeBox(audio_target);
        showButton("i[data-audio='" + audio_target + "']");
        hideButton(this);
        playAudioById(audio_target);
    })
    $(".fa-volume-up").on('click', function() {
        var audio_target = $(this).attr("data-audio");
        showButton("i[data-audio='" + audio_target + "']");
        hideButton(this);
        var audio = $("#" + audio_target)[0];
        audio.pause();
    })

})