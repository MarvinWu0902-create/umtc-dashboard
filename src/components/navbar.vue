<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const showDropDown = ref({
  One: false,
  Two: false,
});

const toggleDropDown = (key) => {
  showDropDown.value[key] = !showDropDown.value[key];
  console.log('showDropDown',showDropDown.value);
  for (const prop in showDropDown.value){
    if(prop!=key){
      showDropDown.value[prop]=false;
    }
  }
  
};
const hideDropdown = (key) => {
  showDropDown.value[key] = false;
};
</script>
<template>
  <nav>
    <ul class="nav-menu">
      <li>
        <router-link to="/">Home</router-link>
        <!-- <router-link to="/index">index</router-link> -->
      </li>
      <li>
        <a @click="toggleDropDown('One')">One</a>
        <ul class="dropdown_menu" v-if="showDropDown.One" @click="hideDropdown('One')">
          <li><router-link to="/1">1-1</router-link></li>
          <li><router-link to="../navitem1-2.vue">1-2</router-link></li>
          <li><router-link to="../navitem1-3.vue">1-3</router-link></li>
        </ul>
      </li>
      <li>
        <a @click="toggleDropDown('Two')">Two</a>
        <ul class="dropdown_menu" v-if="showDropDown.Two" @click="hideDropdown('Two')">
          <li><router-link to="../navitem2-1.vue">2-1</router-link></li>
          <li><router-link to="../navitem2-2.vue">2-2</router-link></li>
          <li><router-link to="../navitem2-3.vue">2-3</router-link></li>
          <li><a href="http://wymana1649:88/index.php">2-4</a></li>

          <!-- ./index.php Server測試使用相對路徑--> 
          <!-- http://wymana1649:88/index.php 本地/Server測試都可使用絕對路徑-->
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style>
a{
  cursor: pointer;
}

.nav-menu {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.nav-menu li{
  padding-left: 5%;
}
.nav-menu li ul{
  position: fixed;
    width: 20%;
}
</style>
