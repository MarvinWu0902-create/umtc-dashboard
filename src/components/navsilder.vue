<template>
      <div class="header-area">
          <nav class="navbar navbar-expand navbar-light navbar-color">
            <div class="container-fluid bar-width">
              <p class="timestr">現在時間是:{{CurrentTime}}</p><p class="onlinestr">目前上線人數：{{login}}人</p>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="nav navbar-nav ml-auto">
                  <li class="">
                    <a class="nav-link" href="http://10.22.66.28:8000/"
                      ><i class="fa fa-tachometer"></i>YM Dashboard</a
                    >
                  </li>
                  <li class="">
                    <a class="nav-link" href="http://10.22.66.28:8001/"
                      ><i class="fa fa-database"></i>YM2 Dashboard</a
                    >
                  </li>
                  <li class="">
                    <a class="nav-link" href="http://10.13.65.223/"
                      ><i class="fa fa-home"></i>回到Unimicron首頁</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </nav>
      </div>
</template>

<script setup>
import { ref,onMounted } from "vue";
import axios from 'axios';

const login=ref(0);
const CurrentTime=ref(new Date().toLocaleString());

const getUsers=()=>{
    axios.get('http://localhost:88/navsilder_vue.php')
    .then(res=>{
        login.value=res.data
    })
    .catch(err=>{
        console.log(err);
    })
}


setInterval(()=>{
    CurrentTime.value=new Date().toLocaleString();
    getUsers();
},100);

const initializeMatomo = () => {
  var _paq = (window._paq = window._paq || []);

  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */

  _paq.push(["trackPageView"]);

  _paq.push(["enableLinkTracking"]);

  (function () {
    var u = "//wsyp2p36569/s2factory/matomo/";

    _paq.push(["setTrackerUrl", u + "matomo.php"]);

    _paq.push(["setSiteId", "3"]);

    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];

    g.async = true;
    g.src = u + "matomo.js";
    s.parentNode.insertBefore(g, s);
  })();
};

onMounted(() => {
  initializeMatomo();
});
</script>

<style>

#content {
    padding: 10px 0px 0px 10px;
    margin: 0px 0px 0px 10%;
    width: 150%;
}

.bar-width {width:100% !important;background-color: '#ffffff00' !important}


.navbar-color{
    background-color: '#ffffff00' !important
}

.timestr,.onlinestr {
margin:15px;
}
</style>
