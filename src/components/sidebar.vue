<template>
    <div class="side">
    <nav id="sidebar">
      <ul class="list-unstyled components "><!-- mb-5 -->
        <li >
          <a href="index.php"
            ><span class="fa fa-microchip"></span>P Dashboard</a
          >
        </li>
        <li>
          <a href="nonpindex.php"
            ><span class="fa fa-object-group"></span>HBS Dashboard</a
          >
        </li>
        <li>
          <a href="ftindex.php"
            ><span class="fa fa-universal-access"></span>FT Dashboard</a
          >
        </li>
        <li>
          <a href="fmindex.php"
            ><span class="fa fa-industry"></span>FM Dashboard</a
          >
        </li>
        <li>
          <a href="aiindex.php"
            ><span class="fa fa-chain-broken"></span> AutoML</a
          >
        </li>
        <li>
          <a href="system_link.php"
            ><span class="fa fa-cogs"></span> System_link</a
          >
        </li>
      </ul>
    </nav>
    </div>
</template>

<script setup>

</script>

<style >
.side {
  height: 100%;
  background-color: rgb(80, 131, 209,0.95);
  position: fixed;
}
#sidebar ul li {
    width: 80px;
    height: 80px;
    text-align: center;
    background-color: rgb(190 208 190 / 27%);
    margin: 5px;
    padding-top: 10px;
    border-radius: 40px;
}
#sidebar ul li a {
    font-size: 10px;
    font-weight: 600;
    color: white;
    padding: 10px 0px 0px 5px;
    text-decoration:none
}
#sidebar ul li a svg {
    width: 30px;
    height: 30px;
}

</style>