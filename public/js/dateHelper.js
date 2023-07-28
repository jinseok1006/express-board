const dateElements = document.querySelectorAll('.date-helper');

dateElements.forEach((dateElement) => {
  const momentString = moment(new Date(dateElement.dataset.date)).fromNow();
  dateElement.innerText = momentString;
});
