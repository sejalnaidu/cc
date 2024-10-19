function positionCoursePaddles(){
    try{
        const rightPaddle = document.querySelector(".courses-right-paddle");
        const leftPaddle = document.querySelector(".courses-left-paddle");
        const element = document.querySelector(".courses-placeholder-div-for-you");

        if (element) {
            const elementRect = element.getBoundingClientRect();
            const arrowTop = (elementRect.height / 2) - (rightPaddle.offsetHeight / 2) + 40;

            let rightPaddleArrowLeft = elementRect.left + window.scrollX + elementRect.width - 20;
            if (window.innerWidth > 767 && window.innerWidth < 1280) {
                rightPaddleArrowLeft = elementRect.left + window.scrollX + elementRect.width - 34;
            }
            const leftPaddleArrowLeft = elementRect.left + window.scrollX - 10;

            rightPaddle.style.position = 'absolute';
            rightPaddle.style.top = `${arrowTop}px`;
            rightPaddle.style.left = `${rightPaddleArrowLeft}px`;

            leftPaddle.style.position = 'absolute';
            leftPaddle.style.top = `${arrowTop}px`;
            leftPaddle.style.left = `${leftPaddleArrowLeft}px`;
        }
    }catch(err){
        console.log(err);
    }
}

function coursesScrollListener(){
    try {
        const placeholderDiv = document.querySelector('.courses-placeholder-div-for-you');

        placeholderDiv.addEventListener('scroll', function(e) {
            let scrollLeft = e.target.scrollLeft;
            const featuredParent = document.querySelector('.courses-featured-parent');
            const featuredHeader = document.querySelector('.featured-header');

            if (scrollLeft > 9) {
                featuredParent.style.paddingLeft = "0px";
                featuredHeader.style.paddingLeft = "16px";
            } else {
                featuredParent.style.paddingLeft = "16px";
                featuredHeader.style.paddingLeft = "0px";
            }
        });
    } catch (err) {
        console.log(err);
    }
}

function coursePaddleClickListeners(scroll, rightCounter){
    let scrollDuration = 600;
    const rightPaddle = document.getElementById('courses-right-paddle');
    const leftPaddle = document.getElementById('courses-left-paddle');
    const placeholderDiv = document.querySelector('.courses-placeholder-div-for-you');

    rightPaddle.addEventListener('click', function(e) {
        try {
            leftPaddle.classList.remove('hidden');
            let max;

            if (window.innerWidth >= 1280) {
                scroll += 960;
                max = 1;
            } else {
                scroll += 620;
                max = 2;
            }

            if (rightCounter < max) {
                placeholderDiv.scrollTo({
                    left: scroll,
                    behavior: 'smooth',
                    scrollDuration
                });
            }

            rightCounter += 1;

            if (rightCounter === max) {
                rightPaddle.classList.add('hidden');
            }
        } catch (err) {
            console.error(err);
        }
    });

    leftPaddle.addEventListener('click', function(e) {
        try {
            rightCounter -= 1;
            rightPaddle.classList.remove('hidden');
    
            if (window.innerWidth >= 1280) {
                scroll -= 960;
            } else {
                scroll -= 620;
            }
    
            if (scroll >= 0) {
                placeholderDiv.scrollTo({
                    left: scroll,
                    behavior: 'smooth'
                });
    
                if (scroll === 0) {
                    leftPaddle.classList.add('hidden');
                }
            }
        } catch (err) {
            console.error(err);
        }
    });
}

async function renderCourseCards(forYouCommunities){
    try {

        // const response = await fetch(`https://community-dev.adobe.io/api/v1/dynamodb/courses`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-api-Key': 'alfred-community-hubs',
        //     }
        // });
        // const fetchedCourses = await response.json();
        // const recommendedcourses =  fetchedCourses.filter(course => forYouCommunities.includes(course.category));

        // console.log("recommended courses:", recommendedcourses);

        const resp = await fetch('https://main--cc--sejalnaidu.hlx.page/drafts/snaidu/community/authorings/recommendedcourses.json');
        const {data} = await resp.json();

        const placeholders = document.querySelectorAll('.featured-card-wrapper');
        placeholders.forEach((element, index) => {

            let productJson = data[index];

            const banner = element.querySelector('.course-banner');
            banner.classList.remove('ghost-load-cards');
            banner.style.backgroundImage = `url(${productJson['image']})`;
            banner.style.backgroundSize = "cover";

            const titleSpan = document.createElement('span');
            titleSpan.innerHTML = productJson['title'];
            const title = element.querySelector('.product-title');
            title.classList.remove('ghost-load-cards');
            title.classList.remove('box-style');
            title.appendChild(titleSpan);

            const descSpan = document.createElement('span');
            descSpan.innerHTML = productJson['description'];
            const desc = element.querySelector('.product-stat-count');
            desc.classList.remove('ghost-load-cards');
            desc.classList.remove('box-style');
            desc.appendChild(descSpan);

            const visit = element.querySelector('.channel-visit-btn');
            visit.classList.remove('ghost-load-cards');
            visit.innerHTML = "View";

            element.addEventListener('click', () => {
                window.location.href = `https://localhost.adobe.com:8002/courses/${productJson['id']}`;
            });
        });
    } catch (err) {
        console.log(err)
    }
}

async function fetchCoursesContent(scroll, rightCounter, max){
    try{
        const res = await fetch('https://community-dev.adobe.com/plugins/custom/adobe/adobedxdev/get-featured-communities');
        const data = await res.json();
   
        if(Object.keys(data).length > 0){
            renderCourseCards(data['list']);
            if(window.innerWidth <= 767){
                coursesScrollListener();  
            }else{
                positionCoursePaddles();
                const rightPaddle = document.querySelector(".courses-right-paddle");
                rightPaddle.classList.remove('hidden');
                coursePaddleClickListeners(scroll, rightCounter, max);
            }
        }
    }catch(err){
        console.log(err);
    }
}

export default async function init(el) {
    
    const featuredParent = document.createElement('div');
    featuredParent.className = 'courses-featured-parent';

    const leftPaddle = document.createElement('div');
    leftPaddle.id = 'courses-left-paddle';
    leftPaddle.className = 'left-paddle paddle hidden courses-left-paddle';

    const leftPaddleImg = document.createElement('img');
    leftPaddleImg.loading = 'lazy';
    leftPaddleImg.src = 'https://main--cc--sejalnaidu.hlx.page/drafts/snaidu/community/images/s2-icon-left-arrow.svg';
    leftPaddleImg.alt = 'scroll-left';
    leftPaddle.appendChild(leftPaddleImg);

    const rightPaddle = document.createElement('div');
    rightPaddle.id = 'right-paddle';
    rightPaddle.className = 'right-paddle paddle hidden courses-right-paddle';

    const rightPaddleImg = document.createElement('img');
    rightPaddleImg.loading = 'lazy';
    rightPaddleImg.src = 'https://main--cc--sejalnaidu.hlx.page/drafts/snaidu/community/images/s2-icon-right-arrow.svg';
    rightPaddleImg.alt = 'scroll-right';
    rightPaddle.appendChild(rightPaddleImg);

    const featuredCardContainer = document.createElement('div');
    featuredCardContainer.className = 'featured-card-container';

    const featuredHeader = document.createElement('div');
    featuredHeader.className = 'featured-header';

    const featuredTitle = document.createElement('h3');
    featuredTitle.className = 'spectrum-Body1 featured-title';
    featuredTitle.textContent = 'Recommended Courses';
    featuredHeader.appendChild(featuredTitle);

    const placeholderDivForYou = document.createElement('div');
    placeholderDivForYou.className = 'courses-placeholder-div-for-you';

    const cardsLimit = 5;

    for (let number = 0; number <= cardsLimit; number++) {
        const cardWrapper = document.createElement('div');
        cardWrapper.id = `courses-placeholder-div-for-you-${number}`;
        cardWrapper.className = 'featured-card-wrapper';
        if (number === cardsLimit - 1) {
            cardWrapper.classList.add('last');
        }

        const cardBanner = document.createElement('div');
        cardBanner.className = 'channel-card-banner ghost-load-cards course-banner';
        cardWrapper.appendChild(cardBanner);

        const cardContent = document.createElement('div');
        cardContent.className = 'channel-card-content';

        const col1 = document.createElement('div');
        col1.className = 'col1';

        const productTitle = document.createElement('div');
        productTitle.className = 'product-title box-style ghost-load-cards';
        col1.appendChild(productTitle);

        const productDesc = document.createElement('div');
        productDesc.className = 'product-stat-count box-style ghost-load-cards';
        col1.appendChild(productDesc);

        cardContent.appendChild(col1);

        const col2 = document.createElement('div');
        col2.className = 'col2';

        const visitBtn = document.createElement('div');
        visitBtn.className = 'channel-visit-btn ghost-load-cards';
        col2.appendChild(visitBtn);

        cardContent.appendChild(col2);
        cardWrapper.appendChild(cardContent);

        placeholderDivForYou.appendChild(cardWrapper);
    }

    featuredCardContainer.appendChild(featuredHeader);
    featuredCardContainer.appendChild(placeholderDivForYou);

    featuredParent.appendChild(leftPaddle);
    featuredParent.appendChild(rightPaddle);
    featuredParent.appendChild(featuredCardContainer);

    el.appendChild(featuredParent);

    var scroll = 0;
    var rightCounter = 0, max;

    window.addEventListener('resize', function() {                           
        if (window.innerWidth <= 767) {
            coursesScrollListener();
        } else {
            positionCoursePaddles();
        }                           
    });

    fetchCoursesContent(scroll, rightCounter, max);
}