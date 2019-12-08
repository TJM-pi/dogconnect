<template>
    <div class="container">
        <div class="col sm12 m7">
            <!--<h2 class="header">Horizontal Card</h2>-->
            <div class="card horizontal">
                <div class="card-image">
                    <img src="https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" alt="">
                    <!-- <img src="{{cur_user.image}}" alt="">-->
                </div>

                <div class="card-stacked">
                    <div class="card-content">
                        <a href="#"> <h4 class="usernameH4">{{cur_user.alias}}</h4> </a>
                        <p style="margin-bottom:15px;">Ovdje ide opis mog profila ako postoji.</p>
                        <!-- <img src="{{cur_user.opis}}" alt="">-->
                    </div>

                    <div class="card-action">
                        <a href="#" class="btn-floating btn-large waves-effect waves-light blue"><i class="material-icons">add</i></a>
                        <a href="#" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">remove</i></a>
                        <!-- uzmi lat, long, zoom i ispisi dolje string kao konkretnu lokaciju -->
                        <p class="lokacijaP">Zadnje viđen na lokaciji: Lokacija</p>


                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SocialCard",
    props: ["cur_user"],
    data(){
        return{
                
        };
    },
}
</script>

<style lang="scss">
    .card-image{
        width:20%;
        height:auto !important;
    }
    .card-image img{
        height:100%;
        width:100% !important;
    }

    .card-action{
        padding:0px !important;
        text-align:right;
    }

    .card-action a{
        margin: 10px 15px 10px 10px;
    }

    .usernameH4{
        margin: 0px 0px 10px 0px;
        font-weight:600;
    }

    .lokacijaP{
        margin:5px 10px 10px 0px;
        color:gray;
    }

</style>