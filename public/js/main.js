// 通用函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        window.location.href = 'admin.html';
    }
}

// index.html 相关函数
function initIndexPage() {
    const carouselImages = JSON.parse(localStorage.getItem('carouselImages')) || {
        image1: 'img/1.jpg',
        image2: 'img/2.jpg',
        image3: 'img/3.jpg',
        image4: 'img/4.jpg'
    };
    document.getElementById('carouselImg1').src = carouselImages.image1;
    document.getElementById('carouselImg2').src = carouselImages.image2;
    document.getElementById('carouselImg3').src = carouselImages.image3;
    document.getElementById('carouselImg4').src = carouselImages.image4;

    const inspirationalQuotes = JSON.parse(localStorage.getItem('inspirationalQuotes')) || [
        '山高水长，路漫漫其修远兮，吾将上下而求索。',
        '海阔凭鱼跃，天高任鸟飞。',
        '不积跬步，无以至千里；不积小流，无以成江海。',
        '天行健，君子以自强不息；地势坤，君子以厚德载物。',
        '宝剑锋从磨砺出，梅花香自苦寒来。',
        '世上无难事，只怕有心人。'
    ];

    const aboutContent = JSON.parse(localStorage.getItem('aboutContent')) || {
        text1: '这里是锋锋的小站，一个记录生活、分享想法的个人空间。',
        text2: '喜欢动漫、游戏、编程和一切美好的事物。希望这里能给你带来一些温暖和快乐。'
    };
    document.getElementById('aboutText1').textContent = aboutContent.text1;
    document.getElementById('aboutText2').textContent = aboutContent.text2;

    const navBar = document.querySelector('.nav-bar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }

        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const links = document.querySelectorAll('a[href="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
        const dateStr = now.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
        });
        document.getElementById('currentTime').textContent = timeStr;
        document.getElementById('currentDate').textContent = dateStr;
    }

    updateTime();
    setInterval(updateTime, 1000);

    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselDots = document.getElementById('carouselDots');
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isAnimating = false;
    let autoPlayInterval;

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });

    function updateCarousel(animate = true) {
        if (animate) {
            carouselTrack.style.transition = 'transform 0.5s ease';
        } else {
            carouselTrack.style.transition = 'none';
        }
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        if (index < 0) {
            currentSlide = totalSlides - 1;
            updateCarousel(true);
        } else if (index >= totalSlides) {
            currentSlide = 0;
            updateCarousel(true);
        } else {
            currentSlide = index;
            updateCarousel(true);
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    carouselTrack.addEventListener('mouseenter', stopAutoPlay);
    carouselTrack.addEventListener('mouseleave', startAutoPlay);
    
    startAutoPlay();

    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const newQuoteBtn = document.getElementById('newQuoteBtn');

    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
        return inspirationalQuotes[randomIndex];
    }

    function updateQuote() {
        const quote = getRandomQuote();
        quoteText.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        
        setTimeout(() => {
            quoteText.textContent = quote;
            quoteAuthor.textContent = '';
            quoteText.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
        }, 300);
    }

    newQuoteBtn.addEventListener('click', updateQuote);

    quoteText.style.transition = 'opacity 0.3s ease';
    quoteAuthor.style.transition = 'opacity 0.3s ease';

    function loadUpdates() {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const updatesList = document.querySelector('.updates-list');
        updatesList.innerHTML = '';

        posts.slice(0, 5).forEach(post => {
            const updateItem = document.createElement('article');
            updateItem.className = 'update-item';
            updateItem.innerHTML = `
                <div class="update-date">${post.date}</div>
                <div class="update-content">
                    <h3 class="update-title">${post.title}</h3>
                    <p class="update-desc">${post.content.substring(0, 50)}...</p>
                </div>
            `;
            updatesList.appendChild(updateItem);
        });
    }

    loadUpdates();
}

// about.html 相关函数
function initAboutPage() {
    const navBar = document.querySelector('.nav-bar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');

    function loadAboutContent() {
        const aboutContent = JSON.parse(localStorage.getItem('aboutContent')) || {
            text1: '这里是<span class="highlight">锋锋</span>，一个热爱生活的普通人。',
            text2: '喜欢<span class="highlight">动漫</span>、<span class="highlight">游戏</span>、<span class="highlight">编程</span>和一切美好的事物。相信简单的生活也能充满色彩。',
            text3: '这个网站是我记录生活、分享想法的小天地。希望这里能给你带来一些温暖和快乐。'
        };
        const aboutText = document.getElementById('aboutText');
        aboutText.innerHTML = '';
        
        if (aboutContent.text1) {
            const p1 = document.createElement('p');
            p1.innerHTML = aboutContent.text1;
            aboutText.appendChild(p1);
        }
        if (aboutContent.text2) {
            const p2 = document.createElement('p');
            p2.innerHTML = aboutContent.text2;
            aboutText.appendChild(p2);
        }
        if (aboutContent.text3) {
            const p3 = document.createElement('p');
            p3.innerHTML = aboutContent.text3;
            aboutText.appendChild(p3);
        }
    }

    function loadInterestsContent() {
        const interestsContent = JSON.parse(localStorage.getItem('interestsContent')) || {
            anime: '热爱观看各种类型的动漫，从热血少年到治愈日常，每一部都是心灵的慰藉。',
            game: '享受游戏带来的乐趣，无论是独立游戏还是大作，都能找到属于自己的快乐。',
            coding: '用代码创造有趣的项目，享受解决问题的过程，不断学习新技术。',
            music: '喜欢听各种风格的音乐，音乐是生活中不可或缺的调味剂。'
        };
        document.getElementById('animeDesc').textContent = interestsContent.anime;
        document.getElementById('gameDesc').textContent = interestsContent.game;
        document.getElementById('codingDesc').textContent = interestsContent.coding;
        document.getElementById('musicDesc').textContent = interestsContent.music;
    }

    function loadContactContent() {
        const contactContent = JSON.parse(localStorage.getItem('contactContent')) || {
            intro: '如果你想和我交流，可以通过以下方式联系我：',
            email: '邮箱：contact@example.com',
            github: 'GitHub：github.com/yourname',
            twitter: 'Twitter：@yourname'
        };
        const contactText = document.getElementById('contactText');
        contactText.innerHTML = '';
        
        const p1 = document.createElement('p');
        p1.textContent = contactContent.intro;
        contactText.appendChild(p1);
        
        const p2 = document.createElement('p');
        p2.textContent = contactContent.email;
        contactText.appendChild(p2);
        
        const p3 = document.createElement('p');
        p3.textContent = contactContent.github;
        contactText.appendChild(p3);
        
        const p4 = document.createElement('p');
        p4.textContent = contactContent.twitter;
        contactText.appendChild(p4);
    }

    loadAboutContent();
    loadInterestsContent();
    loadContactContent();

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }

        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// blog.html 相关函数
function initBlogPage() {
    const navBar = document.querySelector('.nav-bar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');

    function loadBlogPosts() {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const blogList = document.getElementById('blogList');
        blogList.innerHTML = '';

        posts.forEach(post => {
            const blogItem = document.createElement('article');
            blogItem.className = 'blog-item';
            blogItem.innerHTML = `
                <div class="blog-header">
                    <div class="blog-date">${post.date}</div>
                    <div class="blog-content">
                        <h3 class="blog-title">${post.title}</h3>
                        <p class="blog-desc">${post.content.substring(0, 100)}...</p>
                        <div class="blog-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="blog-meta">
                            <span><i class="fas fa-eye"></i> ${post.views}</span>
                            <span><i class="fas fa-heart"></i> ${post.likes}</span>
                            <span><i class="fas fa-comment"></i> ${post.comments}</span>
                        </div>
                    </div>
                </div>
            `;
            blogList.appendChild(blogItem);
        });
    }

    loadBlogPosts();

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }

        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// admin.html 相关函数
function initAdminPage() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const storedPassword = localStorage.getItem('adminPassword') || 'admin';
        
        if (username === 'admin' && password === storedPassword) {
            window.location.href = 'dashboard.html';
        } else {
            alert('用户名或密码错误！');
        }
    });
}

// dashboard.html 相关函数
function initDashboardPage() {
    function clearForm() {
        document.getElementById('postForm').reset();
    }

    document.getElementById('postForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const category = document.getElementById('postCategory').value;
        const tags = document.getElementById('postTags').value;
        const content = document.getElementById('postContent').value;

        const categoryMap = {
            'life': '生活',
            'tech': '技术',
            'anime': '动漫',
            'game': '游戏'
        };

        const newPost = {
            id: Date.now(),
            title: title,
            category: categoryMap[category] || '日记',
            tags: tags.split(',').map(tag => tag.trim()),
            content: content,
            date: new Date().toISOString().split('T')[0],
            views: 0,
            likes: 0,
            comments: 0
        };

        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts.unshift(newPost);
        localStorage.setItem('blogPosts', JSON.stringify(posts));

        alert('文章 "' + title + '" 发布成功！');
        clearForm();
        loadRecentPosts();
    });

    function loadRecentPosts() {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const postsList = document.querySelector('.posts-list');
        postsList.innerHTML = '';

        // 添加空状态提示
        if (posts.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.textAlign = 'center';
            emptyDiv.style.padding = '40px';
            emptyDiv.style.color = 'var(--text-secondary)';
            emptyDiv.textContent = '暂无文章';
            postsList.appendChild(emptyDiv);
            return;
        }

        posts.slice(0, 5).forEach(post => {
            const postItem = document.createElement('div');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <div class="post-info">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span><i class="fas fa-calendar"></i> ${post.date}</span>
                        <span><i class="fas fa-folder"></i> ${post.category}</span>
                        <span><i class="fas fa-eye"></i> ${post.views}</span>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="action-btn edit" onclick="editPost(${post.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="action-btn delete" onclick="deletePost(${post.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            `;
            postsList.appendChild(postItem);
        });
    }

    window.editPost = function(id) {
        if (confirm('确定要编辑这篇文章吗？')) {
            localStorage.setItem('editingPostId', id);
            window.location.href = 'dashboard.html?edit=' + id;
        }
    };

    window.deletePost = function(id) {
        if (confirm('确定要删除这篇文章吗？')) {
            let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
            posts = posts.filter(post => post.id !== id);
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            loadRecentPosts();
        }
    };

    loadRecentPosts();
}

// posts.html 相关函数
function initPostsPage() {
    function loadPosts(filter = '全部') {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const postsList = document.querySelector('.posts-list');
        postsList.innerHTML = '';

        // 添加空状态提示容器
        const noPostsDiv = document.createElement('div');
        noPostsDiv.className = 'no-posts';
        noPostsDiv.style.textAlign = 'center';
        noPostsDiv.style.padding = '40px';
        noPostsDiv.style.color = 'var(--text-secondary)';
        
        const filteredPosts = filter === '全部' ? posts : posts.filter(p => p.category === filter);

        if (filteredPosts.length === 0) {
            noPostsDiv.textContent = '暂无文章';
            postsList.appendChild(noPostsDiv);
            return;
        }

        filteredPosts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <div class="post-info">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span><i class="fas fa-calendar"></i> ${post.date}</span>
                        <span><i class="fas fa-folder"></i> ${post.category}</span>
                        <span><i class="fas fa-eye"></i> ${post.views}</span>
                        <span><i class="fas fa-heart"></i> ${post.likes}</span>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="action-btn view" onclick="viewPost(${post.id})">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                    <button class="action-btn edit" onclick="editPost(${post.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="action-btn delete" onclick="deletePost(${post.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            `;
            postsList.appendChild(postItem);
        });
    }

    window.viewPost = function(id) {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const post = posts.find(p => p.id === id);
        if (post) {
            alert(`标题: ${post.title}\n分类: ${post.category}\n日期: ${post.date}\n内容: ${post.content}`);
        } else {
            alert('文章未找到！');
        }
    };

    window.editPost = function(id) {
        if (confirm('确定要编辑这篇文章吗？')) {
            localStorage.setItem('editingPostId', id);
            window.location.href = 'dashboard.html?edit=' + id;
        }
    };

    window.deletePost = function(id) {
        if (confirm('确定要删除这篇文章吗？')) {
            let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
            posts = posts.filter(post => post.id !== id);
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            loadPosts();
        }
    };

    function searchPosts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const postsList = document.querySelector('.posts-list');
        postsList.innerHTML = '';

        if (!searchTerm) {
            loadPosts();
            return;
        }

        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            (post.content && post.content.toLowerCase().includes(searchTerm))
        );

        const noPostsDiv = document.createElement('div');
        noPostsDiv.className = 'no-posts';
        noPostsDiv.style.textAlign = 'center';
        noPostsDiv.style.padding = '40px';
        noPostsDiv.style.color = 'var(--text-secondary)';

        if (filteredPosts.length === 0) {
            noPostsDiv.textContent = '未找到匹配的文章';
            postsList.appendChild(noPostsDiv);
            return;
        }

        filteredPosts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <div class="post-info">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span><i class="fas fa-calendar"></i> ${post.date}</span>
                        <span><i class="fas fa-folder"></i> ${post.category}</span>
                        <span><i class="fas fa-eye"></i> ${post.views}</span>
                        <span><i class="fas fa-heart"></i> ${post.likes}</span>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="action-btn view" onclick="viewPost(${post.id})">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                    <button class="action-btn edit" onclick="editPost(${post.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="action-btn delete" onclick="deletePost(${post.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            `;
            postsList.appendChild(postItem);
        });
    }

    // 初始化筛选按钮事件
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            loadPosts(filter);
        });
    });

    // 加载初始文章列表
    loadPosts();
    
    // 绑定搜索函数到全局作用域
    window.searchPosts = searchPosts;
}

// settings.html 相关函数
function initSettingsPage() {
    // 页面加载时：填充数据
    // 填充轮播图
    const images = JSON.parse(localStorage.getItem('carouselImages')) || { image1: 'img/1.jpg', image2: 'img/2.jpg', image3: 'img/3.jpg', image4: 'img/4.jpg' };
    document.getElementById('image1').value = images.image1;
    document.getElementById('image2').value = images.image2;
    document.getElementById('image3').value = images.image3;
    document.getElementById('image4').value = images.image4;

    // 填充语录
    const quotes = JSON.parse(localStorage.getItem('inspirationalQuotes')) || [
        '山高水长，路漫漫其修远兮，吾将上下而求索。',
        '海阔凭鱼跃，天高任鸟飞。',
        '不积跬步，无以至千里；不积小流，无以成江海。',
        '天行健，君子以自强不息；地势坤，君子以厚德载物。',
        '宝剑锋从磨砺出，梅花香自苦寒来。',
        '世上无难事，只怕有心人。'
    ];
    document.getElementById('quote1').value = quotes[0] || '';
    document.getElementById('quote2').value = quotes[1] || '';
    document.getElementById('quote3').value = quotes[2] || '';
    document.getElementById('quote4').value = quotes[3] || '';
    document.getElementById('quote5').value = quotes[4] || '';
    document.getElementById('quote6').value = quotes[5] || '';

    // 填充关于内容
    const about = JSON.parse(localStorage.getItem('aboutContent')) || { text1: '', text2: '', text3: '' };
    document.getElementById('aboutText1').value = about.text1;
    document.getElementById('aboutText2').value = about.text2;
    document.getElementById('aboutText3').value = about.text3;

    // 填充兴趣爱好
    const interests = JSON.parse(localStorage.getItem('interestsContent')) || {
        anime: '热爱观看各种类型的动漫，从热血少年到治愈日常，每一部都是心灵的慰藉。',
        game: '享受游戏带来的乐趣，无论是独立游戏还是大作，都能找到属于自己的快乐。',
        coding: '用代码创造有趣的项目，享受解决问题的过程，不断学习新技术。',
        music: '喜欢听各种风格的音乐，音乐是生活中不可或缺的调味剂。'
    };
    document.getElementById('animeDesc').value = interests.anime;
    document.getElementById('gameDesc').value = interests.game;
    document.getElementById('codingDesc').value = interests.coding;
    document.getElementById('musicDesc').value = interests.music;

    // 填充联系方式
    const contact = JSON.parse(localStorage.getItem('contactContent')) || {
        intro: '如果你想和我交流，可以通过以下方式联系我：',
        email: '邮箱：contact@example.com',
        github: 'GitHub：github.com/yourname',
        twitter: 'Twitter：@yourname'
    };
    document.getElementById('contactIntro').value = contact.intro;
    document.getElementById('emailContact').value = contact.email;
    document.getElementById('githubContact').value = contact.github;
    document.getElementById('twitterContact').value = contact.twitter;

    // 保存轮播图
    function saveImages(e) {
        e.preventDefault(); // 阻止表单默认提交刷新
        const images = {
            image1: document.getElementById('image1').value,
            image2: document.getElementById('image2').value,
            image3: document.getElementById('image3').value,
            image4: document.getElementById('image4').value
        };
        localStorage.setItem('carouselImages', JSON.stringify(images));
        alert('轮播图设置已保存！');
    }

    // 保存励志语录
    function saveQuotes(e) {
        e.preventDefault();
        const quotes = [
            document.getElementById('quote1').value,
            document.getElementById('quote2').value,
            document.getElementById('quote3').value,
            document.getElementById('quote4').value,
            document.getElementById('quote5').value,
            document.getElementById('quote6').value
        ];
        localStorage.setItem('inspirationalQuotes', JSON.stringify(quotes));
        alert('励志语录已保存！');
    }

    // 保存关于内容
    function saveAbout(e) {
        e.preventDefault();
        const about = {
            text1: document.getElementById('aboutText1').value,
            text2: document.getElementById('aboutText2').value,
            text3: document.getElementById('aboutText3').value
        };
        localStorage.setItem('aboutContent', JSON.stringify(about));
        alert('关于内容已保存！');
    }

    // 保存兴趣爱好
    function saveInterests(e) {
        e.preventDefault();
        const interests = {
            anime: document.getElementById('animeDesc').value,
            game: document.getElementById('gameDesc').value,
            coding: document.getElementById('codingDesc').value,
            music: document.getElementById('musicDesc').value
        };
        localStorage.setItem('interestsContent', JSON.stringify(interests));
        alert('兴趣爱好内容已保存！');
    }

    // 保存联系方式
    function saveContact(e) {
        e.preventDefault();
        const contact = {
            intro: document.getElementById('contactIntro').value,
            email: document.getElementById('emailContact').value,
            github: document.getElementById('githubContact').value,
            twitter: document.getElementById('twitterContact').value
        };
        localStorage.setItem('contactContent', JSON.stringify(contact));
        alert('联系方式已保存！');
    }

    // 添加表单提交事件监听器
    document.getElementById('imagesForm').addEventListener('submit', saveImages);
    document.getElementById('quotesForm').addEventListener('submit', saveQuotes);
    document.getElementById('aboutForm').addEventListener('submit', saveAbout);
    document.getElementById('interestsForm').addEventListener('submit', saveInterests);
    document.getElementById('contactForm').addEventListener('submit', saveContact);

    // 修改密码逻辑（保持原样，但建议加上 e.preventDefault）
    document.getElementById('securityForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const storedPassword = localStorage.getItem('adminPassword') || 'admin';

        if (currentPassword !== storedPassword) {
            alert('当前密码错误！');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }
        if (newPassword.length < 4) {
            alert('密码长度不能少于4位！');
            return;
        }
        localStorage.setItem('adminPassword', newPassword);
        alert('密码已更新！');
        this.reset();
    });

    // 其他按钮
    window.clearCache = function() {
        if (confirm('确定要清除所有缓存吗？')) {
            localStorage.clear();
            alert('缓存已清除！页面将刷新。');
            location.reload();
        }
    };
    
    window.resetSettings = function() {
        if (confirm('确定要重置所有设置吗？此操作无法撤销！')) {
            localStorage.removeItem('carouselImages');
            localStorage.removeItem('inspirationalQuotes');
            localStorage.removeItem('aboutContent');
            localStorage.removeItem('interestsContent');
            localStorage.removeItem('contactContent');
            localStorage.removeItem('blogPosts');
            alert('设置已重置！页面将刷新。');
            location.reload();
        }
    };
}

// DOM加载完成后执行相应初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 根据当前页面执行相应的初始化函数
    if (document.body.classList.contains('admin-page')) {
        if (window.location.pathname.includes('admin.html')) {
            initAdminPage();
        } else if (window.location.pathname.includes('dashboard.html')) {
            initDashboardPage();
        } else if (window.location.pathname.includes('posts.html')) {
            initPostsPage();
        } else if (window.location.pathname.includes('settings.html')) {
            initSettingsPage();
        }
    } else {
        if (window.location.pathname.includes('index.html')) {
            initIndexPage();
        } else if (window.location.pathname.includes('about.html')) {
            initAboutPage();
        } else if (window.location.pathname.includes('blog.html')) {
            initBlogPage();
        }
    }
});