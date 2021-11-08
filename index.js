let state = {
  selectStateInput: "",
  breweries: [],
  cities: [],
  filters: {
    type: "",
    city: [],
    search: ""
  }
};


const userInput = document.querySelector('input');
let brewType = ['micro','brewpub','regional'];

// empty main display======================
const emptyMain = () => {
  const main = document.querySelector('main');
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

// repeated city filter
const cityFormUpdate = (stateUpdate) => {
  const cityForm = document.querySelector('#filter-by-city-form');
  for(let i=0; i<stateUpdate.cities.length; i++){
    const input = document.createElement('input');
    const label = document.createElement('label');
    label.innerText = stateUpdate.cities[i];
    label.setAttribute('for', stateUpdate.cities[i]);
    let inputObj ={
      type: 'checkbox',
      name: stateUpdate.cities[i],
      value: stateUpdate.cities[i]
    }
    setAttributesFn(input,inputObj);
    cityForm.append(input,label);
  }
  return cityForm
}


// repeated function list
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



// set attributes function=================
const setAttributesFn = (el, attrs) => {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}

// Display filter header==================
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


// Display title===================
const titleDisplay = (main) =>{
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


const breweryListHeader = () => {
  const main = document.querySelector('main');
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
  titleDisplay(main);
}

const renderFn = () => {
  breweryListHeader();
}

// add pagination
// const addPagination = (state) => {
//   if(state.breweries.length > 10){
//     console.log('me');
//     const main = document.querySelector('main');
//     const paginationDiv = document.createElement('div');
//     paginationDiv.classList.add('pagination')
//     const paginationUl = document.createElement('ul');
//     paginationUl.classList.add('pagi-group');
//     paginationDiv.append(paginationUl);
//     main.append(paginationDiv);
//     paginationUl.innerHTML = `
//       <li>1</li>
//       <li>2</li>
//       <li>3</li>
//     `
//   }
// }

// get user search value
const getSearchValue = (stateUpdate) => {
  const searchForm = document.querySelector('#search-breweries-form');
  const searchInput = searchForm.querySelector('#search-breweries');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchInput.addEventListener('keyup', e => {
      emptyList();
      if(e.key === "Enter"){
        const value = e.target.value.toLowerCase();
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
    })
  })
}
  
// clear all filters==================================
const clearFilter = (stateUpdate,target) => {
  const clearBtn = document.querySelector('.clear-all-btn');
  clearBtn.addEventListener('click', (e) => {
    if(target){
      target.checked = false;
    }
    listUpdate(stateUpdate)
  })
}




let array =[]
// filter by city =====================================
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



// listen to filter by city
const listenToFilterByCity = (stateUpdate) => {
  var checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        let target = e.target;
        let valueCity = e.target.value;
        filterByCity(valueCity,stateUpdate,target);
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


// update state======================================
const updatedState = (newState,state) => {
  state = {...state, ...newState};
  console.log('updated state:', state);
  const main = document.querySelector('main');
  if(main.innerHTML !== ''){
    emptyMain();
    renderFn();
    listUpdate(state);
    cityFormUpdate(state);
    listenToFilterByType(state)
    listenToFilterByCity(state)
    getSearchValue(state)
    addPagination(state)
    
  }else{
    renderFn();
    listUpdate(state);
    cityFormUpdate(state);
    listenToFilterByType(state)
    listenToFilterByCity(state)
    getSearchValue(state)
    addPagination(state)
  }
  
}

// create new state==================================
const createNewState = (breweryArr,value,cities) =>{
  let newState = {
    selectStateInput: value,
    breweries: breweryArr,
    cities: cities,
    brewTypes: brewType,
    filters: {
      type: "",
      city: [],
      search: ""
    }
  };
  updatedState(newState,value);
}

// create city array & create new state ===============
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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    userInput.addEventListener('keyup', e => {
      if(e.key === "Enter"){
        const value = e.target.value.toLowerCase();
        fetchDataForUser(value);
      }
    })
  })
}


// init app===================
const init = () => {
  getUserInput();
}
init();

