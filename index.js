let UsState = {
  selectStateInput: "",
  breweries: [],
  cities: [],
  filters: {
    type: "",
    city: [],
    search: ""
  }
};

const main = document.querySelector('main');
const userInput = document.querySelector('input');

let brewType = ['micro','brewpub','regional'];

// empty main display======================
const emptyMain = () => {
  main.innerHTML = '';
}

// empty list display======================
const emptyList = () => {
  const breweriesList = document.querySelector('.breweries-list');
  const list = breweriesList.querySelectorAll('li');
  for(let i=0; i<list.length; i++){
    list[i].remove();
  }
}

// update list =================================
const listUpdate = (stateUpdate) => {
  const listContainer = document.querySelector('.breweries-list');
  listContainer.innerHTML = stateUpdate.breweries.map(eachBrew => 
    `<li>
      <h2>${eachBrew.name}</h2>
      <div class="type">${eachBrew.brewery_type}</div>
      <section class="address">
          <h3>Address:</h3>
          <p>${eachBrew.street}</p>
          <p><strong>${eachBrew.city}, ${eachBrew.postal_code}</strong></p>
        </section>
        <section class="phone">
          <h3>Phone:</h3>
          <p>${eachBrew.phone ? '+' + eachBrew.phone : '-'}</p>
        </section>
        <section class="link">
          <a href="${eachBrew.website_url}" target="_blank">Visit Website</a>
        </section>
      </li>
  `).join('');
}

// update city form ===========================
const cityFormUpdate = (stateUpdate) => {
  const cityForm = document.querySelector('#filter-by-city-form');

  let uniqueCity = [...new Set(stateUpdate.cities)];
  uniqueCity.map(city => {
    const input = document.createElement('input');
    const label = document.createElement('label');
    label.innerText = city;
    label.setAttribute('for', city);
    let inputObj ={
      type: 'checkbox',
      name: city,
      value:city
    }
    setAttributesFn(input,inputObj);
    cityForm.append(input,label);
  })
}
// set attributes function (html)=================
const setAttributesFn = (el, attrs) => {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}
// Display filter header section(html)==================
const cityHeaderDisplay = (aside) => {
  const filterCityDiv = document.createElement('div');
  filterCityDiv.classList.add('filter-by-city-heading');
  const cityTitle = document.createElement('h3');
  cityTitle.innerText = 'Cities'
  const clearBtn = document.createElement('button');
  clearBtn.classList.add('clear-all-btn');
  clearBtn.innerText = 'clear all';
  filterCityDiv.append(cityTitle,clearBtn);
  const cityForm = document.createElement('form');
  cityForm.setAttribute('id', 'filter-by-city-form');
  aside.append(filterCityDiv,cityForm);
}
// Display filter form (html)===================
const formDisplay = (main) =>{
  const aside = document.createElement('aside');
  aside.classList.add('filters-section');
  main.append(aside);
  const title = document.createElement('h2');
  title.innerText = 'Filter By:';
  const form = document.createElement('form');
  let formObj = {
    id: 'filter-by-type-form',
    autocompete: 'off'
  }
  setAttributesFn(form,formObj);
  // create label
  const label = document.createElement('label');
  label.setAttribute('for', 'filter-by-type');
  // create h3
  const brewTitle = document.createElement('h3');
  brewTitle.innerText = 'Type of Brewery';
  label.appendChild(brewTitle);
  // create select
  const select = document.createElement('select');
  let selectObj = {
    id: 'filter-by-type',
    name: 'filter-by-type'
  }
  setAttributesFn(select,selectObj);
  // create options
  select.innerHTML = `
    <option value="">Select a type...</option>
    <option value="micro">Micro</option>
    <option value="regional">Regional</option>
    <option value="brewpub">Brewpub</option>
  `
  form.append(label,select);
  aside.append(title,form);
  cityHeaderDisplay(aside)
}

// Display breewery list header (html)==================
const breweryListHeader = () => {
  const h1 = document.createElement('h1');
  h1.innerText = 'List of Breweries';
  const header = document.createElement('header');
  header.classList.add('search-bar');
  header.innerHTML = `
  <form id="search-breweries-form" autocomplete="off">
    <label for="search-breweries"><h2>Search breweries:</h2></label>
    <input id="search-breweries" name="search-breweries" type="text" />
  </form>
  `

  const article = document.createElement('article');
  const breweriesList = document.createElement('ul');
  breweriesList.classList.add('breweries-list');
  article.appendChild(breweriesList);
  main.append(h1,header,article);
  formDisplay(main);
}
// =====================================================
let currentPage = 1;
let row = 10;

// add pagination======================================
const addPagination = (state) => {
  let breweriesArr = state.breweries
  setupPagination(breweriesArr,row);
}

// setup Pagination =======================================================
const setupPagination = (breweriesArr,rowsPerPage) =>{
  let pageCount = Math.ceil(breweriesArr.length/rowsPerPage);
  let buttonContainer = document.createElement('div');
  buttonContainer.classList.add('btn-container');
  main.append(buttonContainer);
  for(let i=1; i<pageCount + 1; i++){
    let btn = paginationButton(i,breweriesArr);
    buttonContainer.append(btn);
  }
}

// create pagination Button==============================================
const paginationButton = (page,breweriesArr) =>{
  let button = document.createElement('button');
  button.classList.add('btn');
  button.innerText = page;
  if(currentPage === page){
    button.classList.add('active');
  }
  displayList(breweriesArr,currentPage,row);
  button.addEventListener('click', () => {
    currentPage = page
    displayList(breweriesArr,currentPage,row);
    let currentBtn = document.querySelector('.btn-container button.active');
    currentBtn.classList.remove('active');
    button.classList.add('active');
  })
  return button;
}
// display list after pagination=======================================
const displayList = (items,page,rowsPerPage) =>{
  page--;
  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = items.slice(start,end);
  let newState = {
    breweries: paginatedItems,
  };
  listUpdate(newState);
}

// show result of search=========================================
const showResultOfSearch = (stateUpdate,value) => {
  const filteredSearch = stateUpdate.breweries.filter(eachBrew => {
    if(eachBrew.city.toLowerCase() === value || eachBrew.name.toLowerCase() === value){
      return eachBrew
    }
  })
  let newState = {
    breweries: filteredSearch, 
  };
  listUpdate(newState);
}

// get user search value==================================
const getSearchValue = (stateUpdate) => {
  const searchForm = document.querySelector('#search-breweries-form');
  const searchInput = searchForm.querySelector('#search-breweries');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchInput.addEventListener('keyup', e => {
      emptyList();
      if(e.key === "Enter"){
        const value = e.target.value.toLowerCase();
        showResultOfSearch(stateUpdate,value)
      }
    })
  })
}
  
// clear all filters==================================
const clearFilter = (stateUpdate,target) => {
  const clearBtn = document.querySelector('.clear-all-btn');
  clearBtn.addEventListener('click', () => {
    if(target){
      target.checked = false;
    }
    listUpdate(stateUpdate)
  })
}


// filter by city =====================================
let array =[]
const filterByCity = (valueCity,stateUpdate,target) => {
  stateUpdate.breweries.filter(brewType => {
    if(brewType.city === valueCity){
      return array.push(brewType)
    }
  })
  let newState = {
    breweries: array, 
  };
  listUpdate(newState);
  clearFilter(stateUpdate,target);
}

// remove unchecked item from list======================
function removeUncheckedValue(valueCity){
  const unCheckedIndex = array.findIndex(el => {
    return el.city === valueCity
  })
  array.splice(unCheckedIndex,1);
  let newState = {
    breweries: array, 
  };
  listUpdate(newState);
  // clearFilter(stateUpdate,target);
}

// listen to filter by city=============================
const listenToFilterByCity = (stateUpdate) => {
  var checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      let target = e.target;
      let valueCity = e.target.value;
      if (e.target.checked) {
        filterByCity(valueCity,stateUpdate,target);
      }
      if(!e.target.checked){
        removeUncheckedValue(valueCity);
      }
    });
  })
}

// filter by type data=====================================
const filterByType = (valueType,stateUpdate) => {
  const brewTypeFilter = stateUpdate.breweries.filter(brewType => {
    if(brewType.brewery_type === valueType){
      return brewType
    }
  })
  let newState = {
    breweries: brewTypeFilter, 
  };
  listUpdate(newState);
  clearFilter(stateUpdate);
}

// listen to filter by type========================
const listenToFilterByType = (stateUpdate) => {
  const selectType = document.getElementById('filter-by-type');
  selectType.addEventListener('change',e => {
    emptyList();
    let valueType = e.target.value;
    filterByType(valueType,stateUpdate);
  });
}

// render function=================================
const renderFn = (state) => {
  breweryListHeader();
  if(state.breweries.length > 10){
    addPagination(state)
    cityFormUpdate(state);
    listenToFilterByType(state)
    listenToFilterByCity(state)
    getSearchValue(state)
  }else{
    listUpdate(state);
    cityFormUpdate(state);
    listenToFilterByType(state)
    listenToFilterByCity(state)
    getSearchValue(state)
  }
}

// update state======================================
const updatedState = (newState,UsState) => {
  UsState = {...UsState, ...newState};
  console.log('updated state:', UsState);
  
  if(main.innerHTML !== ''){
    emptyMain();
    renderFn(UsState);
  }else{
    renderFn(UsState);
  }
}

// create new state==================================
const createNewState = (breweryArr,value,cities) =>{
  let newState = {
    selectStateInput: value,
    breweries: breweryArr,
    cities: cities,
    brewTypes: brewType,
  };
  updatedState(newState,UsState);
}

// create city array==============================
const createCityArr = (breweryArr, value) => {
  const cities = breweryArr.map(brew => {
    return brew.city
  });
  createNewState(breweryArr,value,cities);
}

// create brewery array===========================
const createBreweryArr = (data, value) => {
  const breweryArr = data.filter(typeOfBrew => {
    if(brewType.includes(typeOfBrew.brewery_type)){
      return typeOfBrew
    }
  });
  createCityArr(breweryArr, value);
}

// get data from API===============================
const fetchDataForUser = (value) => {
  fetch(`https://api.openbrewerydb.org/breweries?by_state=${value}`)
    .then(res => res.json())
    .then(data => {
      console.log('all data:', data);
      createBreweryArr(data, value)
    });
}

// Get user input================================
const getUserInput = () => {
  userInput.value = '';
  const form = document.querySelector('#select-state-form');
  const input = document.querySelector('#select-state');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let value = input.value.toLowerCase();
    console.log(value);
    fetchDataForUser(value);
    input.value = '';
  })
}


// init app===================
const init = () => {
  getUserInput();
}
init();

