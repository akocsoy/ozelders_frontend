<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import router from '../router';
import { useStore } from 'vuex';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

const store = useStore();
let searchValue = ref("");


onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    searchValue = ""
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    if(store.getters.getEmail != ""){
        router.push({name:"profile", params:{userId:store.getters.getUserId}})
    }else{
        router.push({name:"login"})
    }
    
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const onSearch = ()=>{
    store.dispatch('updateSearchValue', searchValue)
}
</script>

<template>
    <div class="layout-topbar">
        <button class="p-link layout-menu-button layout-topbar-button" style="margin-left: 0; margin-right: 10px;" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>ozelders.com</span>
        </router-link>

        

        <div class="p-inputgroup flex-1 search">
                <InputText placeholder="Keyword" v-model="searchValue" @keyup="onSearch()" class="input"/>
                <Button @click="onSearch()" icon="pi pi-search" class="button"/>
        </div> 

        <div class="layout-topbar-menu profile-button-section" :class="topbarMenuClasses">
            <p class="name-section">{{ store.getters.getName }}</p>
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .layout-topbar{
        display: flex;
        justify-content: space-between !important;
    }
    .search{
        max-width: 300px;
    }
    .search > .input{
        border-top-left-radius: 50px ;
        border-bottom-left-radius: 50px ;
    }
    .search > .button{
        border-top-right-radius: 50px ;
        border-bottom-right-radius: 50px ;
    }
    .name-section{
        display: flex;
        width: fit-content;
        height: fit-content;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin-right: 0;
    }
    .profile-button-section{
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>
