const header = document.querySelector('header');
const form = document.querySelector('form');
const search = document.querySelector('.search');
const submit = document.querySelector('.submit');
const keywords_guide = document.querySelector('.keywords_guide');
const resultsElement = document.querySelector('.results');
const layer = document.querySelector('#layer');
const layer_content = document.querySelector('.layer_content');
const title = document.querySelector('.title');
const delete_value = document.querySelector('.delete_value');
const notice_wrapper = document.querySelector('.notice_wrapper');
const notice_btn = document.querySelector('.notice_btn');
const guide_btn = document.querySelector('.guide_btn')
const content_text = document.querySelector('.content_text');
const close_btn = document.querySelector('.close_btn');
const contents = document.querySelector('.contents');

//notice, guide button click event
notice_btn.addEventListener('click', () => {
    content_text.innerHTML = NOTICE[0];
    document.body.classList.add('scroll_lock');
    notice_wrapper.classList.add('show');
    title.classList.add('blur');
    title.classList.add('zindex');
    contents.classList.add('blur');
    contents.classList.add('show');
    guide_btn.classList.remove('hold');
    notice_btn.classList.add('hold');
});
guide_btn.addEventListener('click', () => {
    content_text.innerHTML = GUIDE[0];
    document.body.classList.add('scroll_lock');
    notice_wrapper.classList.add('show');
    title.classList.add('blur');
    title.classList.add('zindex');
    contents.classList.add('blur');
    contents.classList.add('show');
    notice_btn.classList.remove('hold');
    guide_btn.classList.add('hold');
});
close_btn.addEventListener('click', close_notice );
contents.addEventListener('click', close_notice );
header.addEventListener('click', close_notice);

function close_notice(){
    document.body.classList.remove('scroll_lock');
    notice_wrapper.classList.remove('show');
    title.classList.remove('blur');
    title.classList.remove('zindex');
    contents.classList.remove('blur');
    contents.classList.remove('show'); 
    guide_btn.classList.remove('hold');
    notice_btn.classList.remove('hold');       
}

//title click event(clear page)
title.onclick = () => {
    resultsElement.innerHTML = '';
    search.value = '';
    delete_value.classList.remove('show');
}

function enter(key){
    if(key.keyCode === 13)
        search.submit();
}

//input focus event
search.addEventListener('keyup', () => {
    if( search.value )
        delete_value.classList.add('show');
    else
        delete_value.classList.remove('show');
});
search.addEventListener('focus', () => {
    if( search.value )
        delete_value.classList.add('show');
    search.placeholder = '';
    keywords_guide.classList.add('hide');
});
search.addEventListener('blur', () => {
    search.placeholder = '마물 이름, 드랍 아이템, ...';
});
delete_value.addEventListener('click', () => {
    search.value = '';
    delete_value.classList.remove('show');
    search.focus();
});

function not_found(){
    let div = document.createElement('div');
    div.classList.add('not_found');
    div.innerText = 'No matches found 😥.'
    resultsElement.appendChild(div);
}

submit.addEventListener('click', (event) => {
    search.blur();
    event.preventDefault();
    resultsElement.innerHTML = '';
    header.scrollIntoView({behavior:'smooth'});
    let formData = new FormData(form);
    let keywords = formData.get('keywords');
    // let exception = /[a-zA-Z/?=&]/;
    let exception = /[c-hj-ruw-zC-HJ-RUW-Z/?=&]/;
    let count = 0;
    let monster_name;

    if( keywords.trim().length === 0 || exception.test(keywords) || keywords === '.' || Number(keywords) > 90 ) not_found();
    // if( keywords.trim().length === 0 || exception.test(keywords) || keywords === '.' || 
    // Number(keywords) < 50 || Number(keywords) > 80 ) not_found();
    else
    {
        count = 0;
        monster_name = null;
        let makeTable = function(info)
        {
            let table = document.createElement('div');
            table.classList.add('show_table');
            let tr = document.createElement('ul');

            let td_level = document.createElement('li');
            let td_level_span = document.createElement('span');
            td_level.classList.add('td_level');
            td_level_span.classList.add('level_align');
            td_level_span.innerHTML = 'Lv.'+ info.level;
            if( keywords === info.level )
                td_level_span.classList.add('highlight');
            td_level.appendChild(td_level_span);
            tr.appendChild(td_level);

            let td_hunt = document.createElement('li');
            td_hunt.classList.add('td_hunt');
            if( info.hunt === true )
            {
                let img = document.createElement('img');
                img.classList.add('hunt_icon');
                img.src = 'icon/hunt_icon.png'
                img.alt = '마물 수배서 대상';
                td_hunt.appendChild(img);
            }
            else if( info.hunt === 'B' || info.hunt === 'T' )
            {
                let img = document.createElement('img');
                img.classList.add('SAB_icon');
                img.src = 'icon/B_icon.png';
                if( info.hunt === 'b' ) img.alt = 'B급';
                else img.alt = '트리거 몹'; 
                td_hunt.appendChild(img);
            }
            else if( info.hunt === 'A' || info.hunt === 'S' || info.hunt === 'SS' )
            {
                let img = document.createElement('img');
                img.classList.add('SAB_icon');
                img.src = 'icon/SA_icon.png';
                if( info.hunt === 'A' ) img.alt = 'A급';
                else if( info.hunt === 'S' ) img.alt = 'S급';
                else img.alt = 'SS급'; 
                td_hunt.appendChild(img);
            }
            else if( info.hunt === 'log' )
            {
                let img = document.createElement('img');
                img.classList.add('log_icon');
                img.src = 'icon/hunt_log.png';
                img.alt = '토벌수첩 대상';
                td_hunt.appendChild(img);
            }
            tr.appendChild(td_hunt);

            let td_name = document.createElement('li');
            let td_name_span = document.createElement('span');
            td_name.classList.add('td_name');
            td_name_span.classList.add('name_align');
            td_name_span.innerHTML = '<a class=\'name\'>' + info.name + '</a>';
            highlight_name(td_name_span, info.name, keywords.toUpperCase());
            if( info.blu === true ){
                let img = document.createElement('img');
                img.classList.add('blu_icon');
                img.src = 'icon/blu_icon.png';
                img.alt = '청마도사 스킬 습득 대상';
                td_name_span.appendChild(img);

                if( info.skill.length > 1 ){
                    let skill_wrapper = document.createElement('span');
                    skill_wrapper.classList.add('skill_wrapper');
                    for( let i = 0 ; i < info.skill.length ; i++ ){
                        let span = document.createElement('span');
                        span.classList.add('blu_skill_p');
                        span.innerHTML = info.skill[i];
                        skill_wrapper.appendChild(span);
                    }
                    td_name_span.appendChild(skill_wrapper);
                }
                else{
                    let span = document.createElement('span');
                    span.classList.add('blu_skill');
                    span.innerHTML = info.skill[0];
                    td_name_span.appendChild(span);
                }
            }
            if( info.zodiac === true ){
                let img = document.createElement('img');
                img.classList.add('zodiac_icon');
                img.src = 'icon/zodiac.png';
                img.alt = '황도십이문서 대상';
                td_name_span.appendChild(img);
            }
            if( info.fate === true ){
                let img = document.createElement('img');
                img.classList.add('fate_icon');
                img.src = 'icon/fate.png';
                img.alt = '마물 수배서 돌발 임무 대상';
                td_name_span.appendChild(img);

                let span = document.createElement('span');
                span.classList.add('fate_title');
                span.innerHTML = info.title;
                td_name_span.appendChild(span);
            }
            td_name.appendChild(td_name_span);
            tr.appendChild(td_name);

            let td_location = document.createElement('li');
            let td_location_p = document.createElement('p');
            td_location.classList.add('td_location');
            td_location_p.classList.add('location_align');
            td_location_p.innerHTML = info.location;
            highlight_location(td_location_p, info.location, keywords);
            td_location.appendChild(td_location_p);
            tr.appendChild(td_location);

            let td_coordinate = document.createElement('li');
            let td_coordinate_span = document.createElement('span');
            td_coordinate.classList.add('td_coordinate');
            td_coordinate_span.classList.add('coordinate_align');
            td_coordinate_span.innerHTML = info.coordinate;
            td_coordinate.appendChild(td_coordinate_span);
            tr.appendChild(td_coordinate);

            let td_drop = document.createElement('li');
            let td_drop_span = document.createElement('span');
            td_drop.classList.add('td_drop');
            td_drop_span.classList.add('drop_align');

            if( info.drop !== '&nbsp' ){
                for( let i = 0 ; i < info.drop.length ; i++ ){
                    let drop_item = document.createElement('p');
                    drop_item.innerHTML = info.drop[i];

                    if( drop_item.innerText.indexOf(keywords) >= 0){
                        if( drop_item.innerText.indexOf(keywords) === 0 ){
                            drop_item.innerHTML = '<span style="color:yellow; font-weight:bold">' + drop_item.innerText.substr(drop_item.innerText.indexOf(keywords), keywords.length) + '</span>' + drop_item.innerText.substr(keywords.length, drop_item.innerText.length);
                        }
                        else if( drop_item.innerText.indexOf(keywords) > 0 ){
                            if( drop_item.innerText.indexOf(keywords) + keywords.length === drop_item.innerText.length ){
                                drop_item.innerHTML = drop_item.innerText.substr(0, drop_item.innerText.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + drop_item.innerText.substr(drop_item.innerText.indexOf(keywords), keywords.length) + '</span>';
                            }
                            else{
                                drop_item.innerHTML = drop_item.innerText.substr(0, drop_item.innerText.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + drop_item.innerText.substr(drop_item.innerText.indexOf(keywords), keywords.length) + '</span>' + drop_item.innerText.substr(drop_item.innerText.indexOf(keywords) + keywords.length, drop_item.innerText.length);
                            }
                        }
                    }
                    td_drop.appendChild(drop_item);
                }
                for( let i = 0 ; i < info.drop.length ; i++ ){
                    let drop_item = document.createElement('span');
                    drop_item.innerHTML = info.drop[i];
                    td_drop_span.appendChild(drop_item);
                }
            }
            if( !td_drop.innerHTML.includes('&nbsp') )
                td_drop.id='drop';

            if( info.nickname ){
                let nickname = document.createElement('p');
                nickname.classList.add('nickname');

                for( let i = 0 ; i < STORY.length ; i++ )
                    if( info.nickname === STORY[i].nickname )
                        nickname.innerHTML = STORY[i].nickname + '📜';
    
                td_drop.appendChild(nickname);
            }

            td_drop.appendChild(td_drop_span);       
            tr.appendChild(td_drop);

            table.appendChild(tr);
            resultsElement.appendChild(table);
            monster_name = info.name;
            count++;
        }
        for( let key in DATA )
        {
            for( let i = 0 ; i < DATA[key].length ; i++ )
            {
                if( keywords.toUpperCase() === DATA[key][i].hunt )
                    makeTable(DATA[key][i]);
                else if( (keywords === '토벌' || keywords === '토벌수첩' ) && DATA[key][i].hunt === 'log')
                    makeTable(DATA[key][i]);
                else if( (keywords === '청마' || keywords === '청마도사' ) && DATA[key][i].blu === true )
                    makeTable(DATA[key][i]);
                else if( (keywords === '돌발' || keywords === '돌발임무' ) && DATA[key][i].fate === true )
                    makeTable(DATA[key][i]);
                else if( (keywords === '고대무기' || keywords === '조디악' || keywords === '황도십이문서' ) && DATA[key][i].zodiac === true )
                    makeTable(DATA[key][i]);
                else if( (keywords === '정예마물' ) && DATA[key][i].nickname )
                    makeTable(DATA[key][i]); 
                else if( Boolean(Number(keywords)) === true && DATA[key][i].level === keywords || DATA[key][i].name.includes(keywords.toUpperCase()) || DATA[key][i].location.includes(keywords) )
                    makeTable(DATA[key][i]);
                else if( Boolean(Number(keywords)) === false ){
                    for( let j = 0 ; j < DATA[key][i].drop.length ; j++ ){
                        if( DATA[key][i].name !== monster_name && DATA[key][i].drop[j].includes(keywords.toUpperCase(), 60) )
                            makeTable(DATA[key][i]);
                    }
                }
            }
        }
        for( let i = 0 ; i < resultsElement.childNodes.length ; i++ )
            resultsElement.childNodes[i].firstChild.childNodes[2].onclick = viewMap;

        for( let i = 0 ; i < resultsElement.childNodes.length ; i++ )
            resultsElement.childNodes[i].firstChild.childNodes[5].childNodes[0].onclick = view_story;

        if( count === 0 ) not_found();
        else
        {
            let div = document.createElement('div');
            div.classList.add('total');
            div.innerText = 'Total : '+ count;
            resultsElement.insertBefore(div, resultsElement.childNodes[0]);
        }
    }
    if( count > 0 ){
        let last_div = document.querySelectorAll('.show_table');
        last_div[last_div.length-1].classList.add('bottom_line');
    }
    let td_drop = document.querySelectorAll('.td_drop');
    td_drop.forEach(drop => drop.addEventListener('mouseenter', () => {
        drop.lastChild.childNodes.forEach(child => child.addEventListener('mouseenter', () => {
            drop.childNodes[get_index(child)].classList.add('hover');
        }));
        drop.lastChild.childNodes.forEach(child => child.addEventListener('mouseleave', () => {
            drop.childNodes[get_index(child)].classList.remove('hover');
        }));
    }));
});

let get_index = elm => [...elm.parentNode.childNodes].indexOf(elm);

function highlight_name(span, string, keywords){
    if( string.indexOf(keywords) >= 0){
        if( string.indexOf(keywords) === 0 ){
            span.innerHTML = '<a class=\'name\'><span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>' + string.substr(keywords.length, string.length) + '</a>';
        }
        else if( string.indexOf(keywords) > 0 ){
            if( string.indexOf(keywords) + keywords.length === string.length ){
                span.innerHTML = '<a class=\'name\'>' + string.substr(0, string.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span></a>';
            }
            else{
                span.innerHTML = '<a class=\'name\'>' + string.substr(0, string.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>' + string.substr(string.indexOf(keywords) + keywords.length, string.length) + '</a>';
            }
        }
    }
}

function highlight_location(span, string, keywords){
    if( string.indexOf(keywords) >= 0){
        if( string.indexOf(keywords) === 0 ){
            span.innerHTML = '<p class=\'location\'><span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>' + string.substr(keywords.length, string.length) + '</p>';
        }
        else if( string.indexOf(keywords) > 0 ){
            if( string.indexOf(keywords) + keywords.length === string.length ){
                span.innerHTML = '<p class=\'location\'>' + string.substr(0, string.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span></p>';
            }
            else{
                span.innerHTML = '<p class=\'location\'>' + string.substr(0, string.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>' + string.substr(string.indexOf(keywords) + keywords.length, string.length) + '</p>';
            }
        }
    }
}

function viewMap(){
    //console.log(this.childNodes[0].firstChild.childNodes[1].innerHTML);
    document.body.classList.add('view_map');
    // document.body.style.overflow = 'hidden';
    layer.style.visibility = 'visible';
    layer.style.opacity = 1;
    
    let img = document.createElement('img');
    img.classList.add('map');
    let found = false;

    //handling overlapped monster name
    if( this.nextSibling.innerText === '검은장막 숲 북부삼림' )
        img.src = 'map/North_Shroud/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '검은장막 숲 동부삼림' )
        img.src = 'map/East_Shroud/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '검은장막 숲 남부삼림' )
        img.src = 'map/South_Shroud/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '저지 라노시아' )
        img.src = 'map/Lower_La_Noscea/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '중부 라노시아' )
        img.src = 'map/Middle_La_Noscea/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '서부 라노시아' )
        img.src = 'map/Western_La_Noscea/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '외지 라노시아' )
        img.src = 'map/Outer_La_Noscea/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '고지 라노시아' )
        img.src = 'map/Upper_La_Noscea/' + this.firstChild.firstChild.innerText + '.jpg';
    // else if( this.nextSibling.innerText === '중부 다날란' )
    //     img.src = 'map/Central_Thanalan/' + this.innerText + '.jpg';
    else if( this.nextSibling.innerText === '서부 다날란' )
        img.src = 'map/Western_Thanalan/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '동부 다날란' )
        img.src = 'map/Eastern_Thanalan/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '남부 다날란' )
        img.src = 'map/Southern_Thanalan/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '북부 다날란' )
        img.src = 'map/Northern_Thanalan/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '모르도나' )
        img.src = 'map/Mor_Dhona/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '커르다스 중앙고지' ){
        img.src = 'map/Coerthas_Central_Highlands/' + this.firstChild.firstChild.innerText + '.jpg';
    }
    else if( this.nextSibling.innerText === '아지스 라' )
        img.src = 'map/Azys_Lla/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '레이크랜드' )
        img.src = 'map/Lakeland/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '라케티카 대삼림' )
        img.src = 'map/The_Raktika_Greatwood/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '일 메그' )
        img.src = 'map/Il_Mheg/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '콜루시아 섬' )
        img.src = 'map/Kholusia/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '템페스트' )
        img.src = 'map/The_Tempest/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '사베네어' )
        img.src = 'map/Thavnair/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '갈레말드' )
        img.src = 'map/Garlemald/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '비탄의 바다' )
        img.src = 'map/Mare_Lamentorum/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '엘피스' )
        img.src = 'map/Elpis/' + this.firstChild.firstChild.innerText + '.jpg';
    else if( this.nextSibling.innerText === '울티마 툴레' )
        img.src = 'map/Ultima_Thule/' + this.firstChild.firstChild.innerText + '.jpg';
    else
        for( let key in DATA)
        {
            for( let i = 0 ; i < DATA[key].length; i++ )
                if( DATA[key][i].name === this.firstChild.firstChild.innerText )
                {
                    img.src = 'map/' + key + '/'+ this.firstChild.firstChild.innerText + '.jpg';
                    found = true; break;
                }
            if( found === true ) break;
        }

    let info = document.createElement('div');
    info.classList.add('info');

    if( this.nextSibling.nextSibling.innerText === '지도 참조' ){
        if( this.firstChild.childNodes.length === 3 )
            info.innerText = this.firstChild.firstChild.innerText + ' - ' + this.firstChild.childNodes[2].innerText;
         else
            info.innerText = this.firstChild.firstChild.innerText;
    }
    else{
        if( this.firstChild.childNodes.length >= 3 ){
            if( this.firstChild.childNodes[2].classList.value === 'skill_wrapper' )
                info.innerText = this.firstChild.firstChild.innerText + ' ' + this.nextSibling.nextSibling.innerText + ' - ' + this.firstChild.childNodes[2].firstElementChild.innerText + ', ' + this.firstChild.childNodes[2].lastElementChild.innerText;
            else if( this.firstChild.childNodes.length === 4 ){
                if(this.firstChild.childNodes[1].classList.value === 'blu_icon')
                    info.innerText = this.firstChild.firstChild.innerText + ' ' + this.nextSibling.nextSibling.innerText + ' - ' + this.firstChild.childNodes[2].innerText;
                else
                    info.innerText = this.firstChild.firstChild.innerText + ' ' + this.nextSibling.nextSibling.innerText + ' - ' + this.firstChild.childNodes[3].innerText;
            }
            else
                info.innerText = this.firstChild.firstChild.innerText + ' ' + this.nextSibling.nextSibling.innerText + ' - ' + this.firstChild.childNodes[2].innerText;
        }
        else{
            info.innerText = this.firstChild.firstChild.innerText + ' ' + this.nextSibling.nextSibling.innerText;
        }
    }

    layer_content.appendChild(info);
    layer_content.appendChild(img);
    
    window.onkeyup = function(esc){
        let key = esc.keyCode ? esc.keyCode : esc.which;

        if( key === 27)
            clearMap(info, img);

    }

    layer.onclick = function(){
        // document.body.style.overflow = 'auto';
        clearMap(info, img);
    }
}

function clearMap(info, img){
    layer.style.visibility = 'hidden';
    layer.style.opacity = 0;
    layer_content.removeChild(info);
    layer_content.removeChild(img);
    document.body.classList.remove('view_map');
}

//view script
function view_story(){
    for( let i = 0 ; i < STORY.length ; i++ )
        if( (this.innerHTML).substr(0, this.innerHTML.length - 2) === STORY[i].nickname ){
            document.body.classList.add('view_map');
            layer_content.classList.add('layer_content_story');
            layer_content.classList.remove('layer_content');
            const layer_content_story = document.querySelector('.layer_content_story');
            layer.style.visibility = 'visible';
            layer.style.opacity = 1;
            
            let script_wrapper = document.createElement('div');
            let bg_img = document.createElement('img')
            let text_wrapper = document.createElement('div');
            let script_title = document.createElement('p');
            let script = document.createElement('p');
            let npc = document.createElement('p');
            script_wrapper.classList.add('script_wrapper');
            bg_img.src='img/bg.jpg';
            script_wrapper.appendChild(bg_img);
            text_wrapper.classList.add('text_wrapper');
            script_title.classList.add('script_title');
            script.classList.add('script');
            npc.classList.add('npc');

            if( STORY[i].nickname === STORY[i].name )
                script_title.innerHTML = ' \'' + STORY[i].name + '\'';
            else
                script_title.innerHTML = STORY[i].nickname + ' \'' + STORY[i].name + '\'';
            script.innerHTML = STORY[i].scrpit;
            npc.innerHTML = '- ' + STORY[i].npc;
            
            text_wrapper.appendChild(script_title);
            text_wrapper.appendChild(script);
            text_wrapper.appendChild(npc);
            script_wrapper.appendChild(text_wrapper);
            layer_content_story.appendChild(script_wrapper);

            window.onkeyup = function(esc){
                let key = esc.keyCode ? esc.keyCode : esc.which;
        
                if( key === 27)
                    clearStory(layer_content_story, script_wrapper);
            }
        
            layer.onclick = function(){
                clearStory(layer_content_story, script_wrapper);
            }
            // console.log(STORY[i].scrpit);
        }      
}

function clearStory(layer_content_story, script_wrapper){
    layer.style.visibility = 'hidden';
    layer.style.opacity = 0;
    layer_content_story.removeChild(script_wrapper);
    layer_content_story.classList.add('layer_content');
    const layer_content = document.querySelector('.layer_content');
    layer_content.classList.remove('layer_content_story');
    document.body.classList.remove('view_map');
}

let top_button = document.querySelector('.top_button');

window.addEventListener('scroll', () => {
    var scroll = window.scrollY;
    
    if (scroll >= 50)
        top_button.classList.add("show");
    else
        top_button.classList.remove("show");

    if( scroll >= header.offsetHeight )
    {
        form.classList.remove('up');
        form.classList.add('scroll');
    }
    else{
        form.classList.remove('scroll');
        form.classList.add('up');
    }
});

// top_button.addEventListener('click', () => {
//     header.scrollIntoView({behavior:'smooth'});
// });

$('a').click(function(){
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 800);
});