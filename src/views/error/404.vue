<template>
    <div class="main">
        <h1>Modern Error Widget</h1>
        <div class="w3layouts_main_grids">
            <div class="w3_main_grid_left">
                <div class="w3l_main_grid">
                    <h2>404</h2>
                </div>
                <h3>page not found!</h3>
            </div>
            <div class="w3_main_grid_right w3_agileits_grid_right">
                <h3>Fusce ornare, tortor ut efficitur vehicula</h3>
                <p>Duis nibh arcu, congue in tristique eget, cursus non erat. Praesent
                    sit amet eros a tortor imperdiet iaculis. Donec in est lacinia, rhoncus
                    sapien sit amet, imperdiet nulla.</p>
            </div>
            <div class="clear"> </div>
        </div>
        <div class="agileits_copyright">
            <p>&nbsp;</p>
        </div>
    </div>
</template>
<style lang="scss" scoped rel="stylesheet/scss">

    /*end reset*/
    h1,h2,h3,h4,h5,h6,input,p,a,select{
        font-family: 'Nunito', sans-serif;
        margin:0;
    }
    /*-- main --*/
    .agileits_copyright{
        text-align: center;
    }
    .agileits_copyright p{
        font-size: 14px;
        color: #fff;
        margin: 3em 0 0;
        line-height: 1.8em;
        padding: 0 1em;
        text-transform: capitalize;
    }
    .agileits_copyright p a{
        color:#fff;
        text-decoration:underline;
    }
    .agileits_copyright p a:hover{
        color:#fff;
        text-decoration:none;
    }
    .main{
        position: absolute;
        left: 0;
        top: 60px;
        width: 100%;
        background:#fff;
        height:calc(100% - 60px);
        overflow-y: hidden;
    }
    .main h1{
        text-align: center;
        color:#fff;
        font-size: 3em;
        margin-bottom: 1em;
        font-weight: 600;
        text-transform:uppercase;
        margin-top: 100px;
    }
    .w3layouts_main_grids{
        width:60%;
        padding:2em 2em 3em;
        background:#fff;
        margin:0 auto;
    }
    .w3_main_grid_left{
        float: left;
        width: 45%;
        padding-right: 3em;
        border-right: 1px solid #999;
    }
    .w3_main_grid_right{
        float:right;
        width: 44%;
        padding-left: 0;

    }
    .w3_main_grid_left h2{
        font-size: 10em;
        color: #0f6d84;
        text-align: right;
        font-weight: bold;
        text-shadow: 0px 5px 1px #514F4F;
        position:relative;
    }
    .w3_main_grid_left h3 {
        font-size:2em;
        color:#FC3A0F;
        text-transform: capitalize;
        text-align: right;
        font-family: 'Open Sans', sans-serif;
    }
    .w3_main_grid_left h2:before{
        content: '';
        width: 130px;
        height: 127px;
        background-size: 80%;
        display: block;
        position: absolute;
        left: 4%;
        top: 38%;
    }
    .w3l_main_grid{
        position: relative;
    }
    .w3ls_form{
        margin: 2em 0 0;
    }

    .w3_main_grid_right h3{
        font-size: 1.3em;
        line-height: 1.5em;
        text-transform: capitalize;
        color: #212121;
        font-family: 'Open Sans', sans-serif;
        font-weight: bold;
    }
    .w3_main_grid_right p{
        color:#999;
        line-height:2em;
        margin:1em 0 2em;
        font-size:14px;
        font-family: 'Open Sans', sans-serif;
    }
    .agileits_main_grid_left{
        float:left;
    }
    .agileits_main_grid_left h4{
        font-size: 14px;
        text-transform: uppercase;
        color: #212121;
        margin: .5em 0 0;
    }
    .agileits_main_grid_right{
        float:left;
        margin-left:2em;
    }
    .agileits_main_grid_right ul li{
        display:inline-block;
    }
    .agileits_main_grid_right ul li a{
        width: 30px;
        height: 30px;
        border-radius: 20px;
        text-align: center;
        display: block;
        position: relative;
    }
    .agileits_main_grid_right ul li a i{
        font-size: 12px;
        color: #fff;
        padding-top: .8em;
    }

    /*-- start-responsive-design --*/
    @media (max-width:1850px){
        .w3_main_grid_left h2:before {
            display: none;
        }
    }
    @media (max-width:1440px){
        .w3layouts_main_grids {
            width: 65%;
        }
    }
    @media (max-width: 1366px){
        .w3layouts_main_grids {
            width: 66%;
        }
    }
    @media (max-width: 1280px){
        .w3layouts_main_grids {
            width: 71%;
        }
        .w3_main_grid_left h2:before {
            left: 0%;
        }
    }
    @media (max-width: 1080px){
        .w3layouts_main_grids {
            width: 85%;
        }
    }
    @media (max-width: 1024px){
        /*-- agileits --*/
        .main h1 {
            font-size: 2.5em;
        }
        .w3_main_grid_left h2 {
            font-size: 9.5em;
        }
        .w3_main_grid_left h2:before {
            display: none;
        }
        .w3_main_grid_left h3 {
            font-size: 1.7em;
        }
        .w3_main_grid_right h3 {
            font-size: 1.2em;
        }
        .w3_main_grid_left {
            width: 44%;
        }
        /* .w3_main_grid_right {
        } */
    }
    @media (max-width: 800px){
        .w3_main_grid_left {
            padding-right: 2em;
        }
        .w3_main_grid_left h2:before {
            display: none;
        }
        .w3_main_grid_left h3 {
            font-size: 1.5em;
        }
        .w3_main_grid_right {
            padding-left: 0;
        }

        .w3_main_grid_right {
            margin:1.5em 0 0;
        }
        /*-- w3layouts --*/
        .w3_main_grid_left h2 {
            font-size: 7.5em;
        }
        .w3_main_grid_right {
            width: 46%;
        }
    }
    @media (max-width: 768px){

        .w3_main_grid_right {
            margin: 1.5em 0 0;
        }
    }
    @media (max-width: 736px){
        .w3_main_grid_left h3 {
            font-size: 1.3em;
        }
        .w3_main_grid_right h3 {
            font-size: 1em;
        }
        .agileits_main_grid_right {
            margin-left: 1em;
        }
        .w3_main_grid_right {
            margin: 0;
            width: 45%;
        }
        .w3layouts_main_grids {
            padding: 2em 2em 2.5em;
        }
        .main h1 {
            font-size: 2.3em;
        }
        .main {
            padding: 3em 0;
        }
    }
    @media (max-width: 667px){
        .w3_main_grid_right {
            width: 44%;
        }
        .w3_main_grid_left h2:before {
            display: none;
            /*-- agileits --*/
        }
        .w3_main_grid_left h2 {
            font-size: 6.5em;
        }

        .agileits_main_grid_left {
            float: none;
            margin-bottom:1em;
        }
        .agileits_main_grid_right {
            float: none;
            margin:0;
        }
    }
    @media (max-width: 600px){
        .w3_main_grid_left {
            float: none;
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #999;
            padding: 0 0 2em;
        }

        .w3_main_grid_right {
            margin: 0;
            float: none;
            width: 100%;
            padding: 2em 0 0;
        }
        .w3_main_grid_left h2 {
            font-size: 7.5em;
            text-align: center;
        }
        .w3_main_grid_left h3 {
            text-align: center;
        }
        .w3_main_grid_left h2:before {
            display: none;
        }
    }
    @media (max-width: 568px){
        .w3_main_grid_left h2:before {
            left: 8%;
        }
        .w3_main_grid_right p {
            margin: 1em 0;
        }
    }
    @media (max-width: 480px){
        .w3layouts_main_grids {
            padding: 1.5em 1.5em 2em;
        }
        .main h1 {
            font-size: 2em;
        }
        .w3_main_grid_left h2:before {
            left: 0%;
        }
        .agileits_copyright p {
            margin: 2em 0 0;
        }
    }
    @media (max-width: 414px){
        .main h1 {
            font-size: 1.8em;
        }
        .w3layouts_main_grids {
            width: 80%;
        }
        .w3_main_grid_left h2:before {
            width: 56px;
            height: 54px;
            top: 55%;
        }

    }
    @media (max-width: 384px){
        .w3layouts_main_grids {
            padding: 0em 1.5em 2em;
        }
        .main h1 {
            font-size: 1.7em;
        }
        .main {
            padding: 2em 0;
        }
        .w3_main_grid_left {
            padding: 0 0 1.5em;
        }
        .w3_main_grid_right {
            padding: 1.5em 0 0;
        }
    }
    @media (max-width: 375px){
        .main h1 {
            font-size: 1.6em;
        }
        .w3_main_grid_left h2 {
            font-size: 7em;
        }
        .w3_main_grid_left h3 {
            font-size: 1.2em;
        }

    }
    @media (max-width: 320px){
        .main h1 {
            font-size: 1.4em;
        }
        .w3_main_grid_left h2 {
            font-size: 5.5em;
        }
        .w3layouts_main_grids {
            padding: 1em 1.3em 2em;
        }
        .w3_main_grid_right p,.agileits_copyright p {
            font-size: 13px;
        }
    }

</style>
<script type="text/ecmascript-6">
export default {
  data () {
    return {}
  },
  props: [],
  watch: {},
  computed: {},
  filter: {},
  methods: {},
  created () {
  },
  mounted () {
  },
  components: {}
}
</script>
