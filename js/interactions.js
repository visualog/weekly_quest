/**
 * 사용자 상호작용 관련 기능을 담당하는 모듈
 */

/**
 * 상호작용 초기화 함수
 */
export function initInteractions() {
  // 이벤트 위임을 통한 북마크 버튼 처리
  document.addEventListener('click', (e) => {
    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn) {
      e.stopPropagation();
      toggleBookmark(bookmarkBtn);
    }
  });

  // 이벤트 위임을 통한 좋아요 버튼 처리
  document.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
      e.stopPropagation();
      toggleLike(likeBtn);
    }
  });

  // 필터 버튼 처리
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterRecipes(btn.textContent.trim());
    });
  });

  // 검색 입력 처리
  const searchInput = document.querySelector('input[type="text"][placeholder*="검색"]');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchRecipes(e.target.value);
    }, 300));
  }
}

/**
 * 북마크 토글 함수
 * @param {HTMLElement} btn - 북마크 버튼 요소
 */
function toggleBookmark(btn) {
  btn.classList.toggle('bookmarked');
  const svg = btn.querySelector('svg');
  
  if (btn.classList.contains('bookmarked')) {
    svg.style.fill = '#F39C12';
    svg.style.color = '#F39C12';
    
    // 접근성: 스크린 리더를 위한 상태 변경 알림
    btn.setAttribute('aria-label', '북마크 됨');
    
    // 북마크 데이터 저장
    saveBookmarkData(btn);
  } else {
    svg.style.fill = 'none';
    svg.style.color = 'currentColor';
    
    // 접근성: 스크린 리더를 위한 상태 변경 알림
    btn.setAttribute('aria-label', '북마크');
    
    // 북마크 데이터 제거
    removeBookmarkData(btn);
  }
  
  // 햅틱 피드백 (지원되는 기기에서)
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

/**
 * 좋아요 토글 함수
 * @param {HTMLElement} btn - 좋아요 버튼 요소
 */
function toggleLike(btn) {
  const isLiked = btn.classList.toggle('liked');
  const countSpan = btn.querySelector('.like-count');
  let currentCount = parseInt(countSpan.textContent);
  
  countSpan.textContent = isLiked ? currentCount + 1 : currentCount - 1;
  
  // 접근성: 스크린 리더를 위한 상태 변경 알림
  btn.setAttribute('aria-label', isLiked ? '좋아요 취소' : '좋아요');
  
  // 햅틱 피드백 (지원되는 기기에서)
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
  
  // 좋아요 데이터 저장
  saveLikeData(btn, isLiked);
}

/**
 * 레시피 필터링 함수
 * @param {string} category - 필터링할 카테고리
 */
function filterRecipes(category) {
  // 실제 구현에서는 여기에 필터링 로직 추가
  console.log(`레시피 필터링: ${category}`);
  
  // 필터링 결과에 대한 접근성 알림
  const statusElement = document.getElementById('filter-status') || createStatusElement();
  statusElement.textContent = `${category} 카테고리로 필터링되었습니다.`;
}

/**
 * 레시피 검색 함수
 * @param {string} query - 검색어
 */
function searchRecipes(query) {
  // 실제 구현에서는 여기에 검색 로직 추가
  console.log(`레시피 검색: ${query}`);
  
  // 검색 결과에 대한 접근성 알림
  const statusElement = document.getElementById('search-status') || createStatusElement('search-status');
  statusElement.textContent = query ? `"${query}" 검색 결과입니다.` : '모든 레시피를 표시합니다.';
}

/**
 * 북마크 데이터 저장 함수
 * @param {HTMLElement} btn - 북마크 버튼 요소
 */
function saveBookmarkData(btn) {
  // 북마크할 레시피 정보 찾기
  const recipeItem = btn.closest('.space-y-1');
  if (!recipeItem) return;
  
  const recipeName = recipeItem.querySelector('p.font-semibold')?.textContent;
  if (!recipeName) return;
  
  // 로컬 스토리지에서 북마크 데이터 가져오기
  const bookmarks = JSON.parse(localStorage.getItem('wq_bookmarks') || '[]');
  
  // 중복 확인 후 추가
  if (!bookmarks.includes(recipeName)) {
    bookmarks.push(recipeName);
    localStorage.setItem('wq_bookmarks', JSON.stringify(bookmarks));
  }
}

/**
 * 북마크 데이터 제거 함수
 * @param {HTMLElement} btn - 북마크 버튼 요소
 */
function removeBookmarkData(btn) {
  // 북마크 해제할 레시피 정보 찾기
  const recipeItem = btn.closest('.space-y-1');
  if (!recipeItem) return;
  
  const recipeName = recipeItem.querySelector('p.font-semibold')?.textContent;
  if (!recipeName) return;
  
  // 로컬 스토리지에서 북마크 데이터 가져와서 제거
  const bookmarks = JSON.parse(localStorage.getItem('wq_bookmarks') || '[]');
  const updatedBookmarks = bookmarks.filter(name => name !== recipeName);
  localStorage.setItem('wq_bookmarks', JSON.stringify(updatedBookmarks));
}

/**
 * 좋아요 데이터 저장 함수
 * @param {HTMLElement} btn - 좋아요 버튼 요소
 * @param {boolean} isLiked - 좋아요 상태
 */
function saveLikeData(btn, isLiked) {
  // 좋아요할 게시물 정보 찾기
  const postItem = btn.closest('.bg-white.smooth-card');
  if (!postItem) return;
  
  // 게시물 ID 또는 식별자 찾기 (실제 구현에서는 고유 ID 사용)
  const postId = postItem.dataset.postId || generateTempId(postItem);
  
  // 로컬 스토리지에서 좋아요 데이터 가져오기
  const likes = JSON.parse(localStorage.getItem('wq_likes') || '{}');
  
  // 좋아요 상태 저장
  if (isLiked) {
    likes[postId] = true;
  } else {
    delete likes[postId];
  }
  
  localStorage.setItem('wq_likes', JSON.stringify(likes));
}

/**
 * 임시 ID 생성 함수 (실제 구현에서는 고유 ID 사용)
 * @param {HTMLElement} element - ID를 생성할 요소
 * @returns {string} 생성된 임시 ID
 */
function generateTempId(element) {
  const content = element.textContent.trim();
  return `temp_${content.slice(0, 10).replace(/\s+/g, '_')}_${Date.now()}`;
}

/**
 * 접근성을 위한 상태 알림 요소 생성
 * @param {string} id - 요소 ID
 * @returns {HTMLElement} 생성된 상태 알림 요소
 */
function createStatusElement(id = 'filter-status') {
  const statusElement = document.createElement('div');
  statusElement.id = id;
  statusElement.className = 'sr-only';
  statusElement.setAttribute('aria-live', 'polite');
  document.body.appendChild(statusElement);
  return statusElement;
}

/**
 * 디바운스 함수 - 연속적인 이벤트 호출 제어
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간 (ms)
 * @returns {Function} 디바운스된 함수
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
