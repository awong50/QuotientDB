document.querySelectorAll('.dropbtn').forEach(button => {
    button.addEventListener('click', function () {
        const dropdownContent = this.nextElementSibling;
        dropdownContent.classList.toggle('show');
  
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.style.display = 'block';
        } else {
            dropdownContent.style.display = 'none';
        }
  
        adjustMainContainerHeight();
    });
  });
  
  function adjustMainContainerHeight() {
    const mainContainer = document.querySelector('.main__container');
    const contentHeight = Array.from(document.querySelectorAll('.dropdown-content'))
        .reduce((total, dropdown) => total + (dropdown.classList.contains('show') ? dropdown.scrollHeight : 0), 0);
    mainContainer.style.minHeight = `${contentHeight + 200}px`; 
  }
  