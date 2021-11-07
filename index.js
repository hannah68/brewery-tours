// - The list has a maximum of 10 breweries on display
// - From the 'filter by city' section, a user can clear all filters
// - From the 'search' section, a user can search for breweries by:
// - Name
// - City

// Instructions
// - Think about which request type to use
// - Create action functions that update state
// - Create render functions that read from state
// Tips
// - Use a cleanData function to modify the data in the fetch request before adding it to state
// - Use an extractCitiesData function to extract the cities from the data in the fetch request and add it to state for the 'filter by city' section
// - For filter by type use a select element to capture user input
// - For filter by city use a list of checkbox elements to capture user input
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

// empty list display=====================
const emptyCity = () => {
  const form = document.querySelector('#filter-by-city-form');
  
  form.innerHTML = '';
}
// repeated city filter
const cityFormUpdate = (state) => {
  const cityForm = document.querySelector('#filter-by-city-form');
  for(let i=0; i<state.cities.length; i++){
    const input = document.createElement('input');
    const label = document.createElement('label');
    label.innerText = state.cities[i];
    label.setAttribute('for', state.cities[i]);
    let inputObj ={
      type: 'checkbox',
      name: state.cities[i],
      value: state.cities[i]
    }
    setAttributesFn(input,inputObj);
    cityForm.append(input,label);
  }
}


// repeated function list
const listUpdate = (state) => {
  const listContainer = document.querySelector('.breweries-list');
  listContainer.innerHTML = state.breweries.map(eachBrew => 
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
  cityFormUpdate(state);
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



// update state======================================
const updatedState = (newState,value) => {
  state = {...state,...newState };
  console.log('updated state:', state);
  // renderFn(state,value);
  breweryListHeader();
  listUpdate(state);
  cityFormUpdate(state);
  // emptyMain()
}

// create new state==================================
const createNewState = (breweryArr,value,cities) =>{
  let newState = {
    selectStateInput: value,
    breweries: breweryArr,
    cities: cities,
    brewTypes: brewType
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
  userInput.value = '';
  fetch(`https://api.openbrewerydb.org/breweries?by_state=${value}`)
    .then(res => res.json())
    .then(data => {
      console.log('all data:', data);
      createBreweryArr(data, value);
    })
}

// Get user input================================
const getUserInput = () => {
  const form = document.querySelector('#select-state-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    userInput.addEventListener('keyup', e => {
      if(e.key === "Enter"){
        const value = e.target.value.toLowerCase();
        fetchDataForUser(value);
        emptyMain()
        
      }
    })
  })
}

// init app===================
const init = () => {
  
  getUserInput();
}
init();

console.log(state);





























// render function===============================
// const renderFn = (state,value) => {
//   createListSectionDisplay(state,value);
//   createFilterDisplay(state);
// }




// // Display list section============================
// const createListSectionDisplay = (state) => {
//   const main = document.querySelector('main');
//   const article = document.createElement('article');
//   main.appendChild(article);
//   const breweriesList = document.createElement('ul');
//   breweriesList.classList.add('breweries-list');
//   article.appendChild(breweriesList);

//   meyfn(breweriesList,state)
  
//   breweriesList.innerHTML = state.breweries.map(eachBrew => 
//     `<li>
//       <h2>${eachBrew.name}</h2>
//       <div class="type">${eachBrew.brewery_type}</div>
//       <section class="address">
//           <h3>Address:</h3>
//           <p>${eachBrew.street}</p>
//           <p><strong>${eachBrew.city}, ${eachBrew.postal_code}</strong></p>
//         </section>
//         <section class="phone">
//           <h3>Phone:</h3>
//           <p>${eachBrew.phone ? '+' + eachBrew.phone : '-'}</p>
//         </section>
//         <section class="link">
//           <a href="${eachBrew.website_url}" target="_blank">Visit Website</a>
//         </section>
//       </li>
//   `).join('');
// }

// // set attributes function=================
// const setAttributesFn = (el, attrs) => {
//   for(var key in attrs) {
//     el.setAttribute(key, attrs[key]);
//     }
// }

// // Display title===================
// const titleDisplay = () =>{
//   const title = document.createElement('h2');
//   title.innerText = 'Filter By:';
//   return title;
// }

// // Display filter form===============
// const filterFormDisplay = (state) => {
//   const form = document.createElement('form');
//   let formObj = {
//     id: 'filter-by-type-form',
//     autocompete: 'off'
//   }
//   setAttributesFn(form,formObj);
//   // create label
//   const label = document.createElement('label');
//   label.setAttribute('for', 'filter-by-type');
//   // create h3
//   const brewTitle = document.createElement('h3');
//   brewTitle.innerText = 'Type of Brewery';
//   label.appendChild(brewTitle);
//   // create select
//   const select = document.createElement('select');
//   let selectObj = {
//     id: 'filter-by-type',
//     name: 'filter-by-type'
//   }
//   setAttributesFn(select,selectObj);
//   // create options
//   const firstOption = document.createElement('option');
//   firstOption.innerText = 'Select a type...';
//   let optionObj = {
//     value: 'default',
//     selected : 'true'
//   }
//   setAttributesFn(firstOption,optionObj);
//   select.innerHTML = state.brewTypes.map(type =>
//     `<option value="${type}">${type}</option>`
//   ).join('');
//   select.insertAdjacentElement("afterbegin", firstOption);
//   form.append(label,select);
//   return form;
// }

// // Display filter header==================
// const cityHeaderDisplay = () => {
//   const filterCityDiv = document.createElement('div');
//   filterCityDiv.classList.add('filter-by-city-heading');
//   const cityTitle = document.createElement('h3');
//   cityTitle.innerText = 'Cities'
//   const clearBtn = document.createElement('button');
//   clearBtn.classList.add('clear-all-btn');
//   clearBtn.innerText = 'clear all';
//   filterCityDiv.append(cityTitle,clearBtn);
//   return filterCityDiv
// }

// // Display Form of filter by city=================
// const filterByCityFormDisplay = (state) => {
//   const cityForm = document.createElement('form');
//   cityForm.setAttribute('id', 'filter-by-city-form');
//   for(let i=0; i<state.cities.length; i++){
//     const input = document.createElement('input');
//     const label = document.createElement('label');
//     label.innerText = state.cities[i];
//     label.setAttribute('for', state.cities[i]);
//     let inputObj ={
//       type: 'checkbox',
//       name: state.cities[i],
//       value: state.cities[i]
//     }
//     setAttributesFn(input,inputObj);
//     cityForm.append(input,label);
//   }
//   return cityForm;
// }


// // filter by type data==================================
// const filterByTypeData = (allData,userValue,type) => {
//   const filteredArr = allData.filter(data => {
//     if(data.state){
//       if(data.state.toLowerCase() === userValue){
//         return data
//       }
//     }
    
//   })
//   const cit = filteredArr.map(brew => {
//     return brew.city
//   });
  
//   let newState = {
//     selectStateInput: userValue,
//     breweries: filteredArr,
//     cities: cit,
//     filters: {
//       type: type,
//     }
//   };
//   updatedState(newState,userValue);
// }


// // fetch data by type====================================
// const fetchByType = (type,state) => {
//   let userValue = state.selectStateInput;
//   fetch(`https://api.openbrewerydb.org/breweries?by_type=${type}`)
//     .then(res => res.json())
//     .then(allData => {
//       console.log(allData);
//       filterByTypeData(allData,userValue,type);
//     })
// }

// // listen to filter by type========================
// const listenToFilterByType = (state) => {
//   const selectType = document.getElementById('filter-by-type');
//   selectType.addEventListener('change',e => {
//     emptyList();
//     emptyCity();
//     let valueType = e.target.value;
//     fetchByType(valueType,state);
//   });
// }


// // create Filter Display=============================
// const createFilterDisplay = (state) => {
//   const main = document.querySelector('main');
//   const aside = document.createElement('aside');
//   aside.classList.add('filters-section');
//   main.appendChild(aside);
//   aside.append(titleDisplay(),filterFormDisplay(state),cityHeaderDisplay(),filterByCityFormDisplay(state));

//   // listen to filter by type
//   listenToFilterByType(state);
// }























