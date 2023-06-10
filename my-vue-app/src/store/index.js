import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
const store = createStore({
  state() {
    return {
      name: '',
      email: '',
      categoryId: 0,
      userId:null,
      isSeller:0,
      searchValue: "",
      starsSort: "",
      priceSort: "",
      
    }
  },
  plugins:[createPersistedState()],
  mutations: {
    setName(state, name) {
      state.name = name
    },
    setSearchValue(state, searchValue){
      state.searchValue = searchValue
    },
    setEmail(state, email) {
      state.email = email
    },
    setCategoryId(state, categoryId){
      state.categoryId = categoryId
    },
    setUserId(state, id){
      state.userId = id;
    },
    setIsSeller(state, isSeller){
      state.isSeller = isSeller;
    },
    signOut(state){
      state.name = '';
      state.email = '';
      state.categoryId = 0;
      state.userId = null;
    },
    setStarsSort(state, starsSortValue){
      state.starsSort = starsSortValue
    },
    setPriceSort(state, priceSortValue){
      state.priceSort = priceSortValue
    }
  },
  actions: {
    updateName({ commit }, name) {
      commit('setName', name)
    },
    updateEmail({ commit }, email) {
      commit('setEmail', email)
    },
    updateCategoryId({commit}, categoryId){
      commit('setCategoryId', categoryId)
    },
    updateUserId({commit}, id){
      commit('setUserId', id)
    },
    signOut({commit}){
      commit('signOut')
    },
    updateIsSeller({commit},isSeller){
      commit('setIsSeller', isSeller)
    },
    updateSearchValue({commit}, searchValue){
      commit('setSearchValue', searchValue)
    },
    updateStarsSort({commit}, starsSortValue){
      commit('setStarsSort', starsSortValue)
    },
    updatePriceSort({commit}, priceSortValue){
      commit('setPriceSort', priceSortValue)
    }
  },
  getters: {
    getName(state) {
      return state.name
    },
    getEmail(state) {
      return state.email
    },
    getCategoryId(state){
      return state.categoryId
    },
    getUserId(state){
      return state.userId
    },
    getIsSeller(state){
      return state.isSeller;
    },
    getSearchValue(state){
      return state.searchValue;
    },
    getStarsSort(state){
      return state.starsSort;
    },
    getPriceSort(state){
      return state.priceSort;
    }
  }
})

export default store
