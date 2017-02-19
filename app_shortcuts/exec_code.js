exports.repeatClickedJScript = `
    var repeatBtn = document.getElementsByClassName('repeatControl')[0];
    repeatBtn.click();
`;

exports.repeatClickedNotify = `
    if(repeatBtn.className.includes("m-none")){
        new Notification('Repeat : Disabled',{
            body:'Repeat has been disabled',
            silent:true
        });
    }else{
        new Notification('Repeat : Enabled',{
            body:'Repeat has been enabled',
            silent:true
        });
    }
`;

exports.likeClicked = `
    var likeBtn = document.getElementsByClassName('playbackSoundBadge__like')[0];
    likeBtn.click();
`;

exports.likeClickedNotify = `
    var title = document.getElementsByClassName('playbackSoundBadge__title')[0].title;
    var imageUrl = document.getElementsByClassName('playbackSoundBadge__avatar')[0].children[0].children[0].style.backgroundImage;
    imageUrl = imageUrl.substring(5,imageUrl.length-2);
    if(likeBtn.className.includes("sc-button-selected")){
        new Notification('Liked',{
            body:title,
            silent:true,
            icon:imageUrl
        });
    }else{
        new Notification('Disliked',{
            body:title,
            silent:true,
            icon:imageUrl
        });
    }
`;

exports.nextClicked=`
    document.getElementsByClassName('playControls__next')[0].click()
`;

exports.prevClicked=`
    document.getElementsByClassName('playControls__prev')[0].click()
`;

exports.pauseClicked=`
    document.getElementsByClassName('playControls__play')[0].click()
`;