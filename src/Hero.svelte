<script>
	import Button from './components/button.svelte'
	let screen = 'desktop'

	if(window.width < 500) isScreenLarge = 'mobile'
</script>
<style>
	header{
		position: relative;
		width: 100vw;

	}
	.wrapper{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		text-align: center;
		width: 80%;
		margin:70px auto 0;
		position: relative;
	}
	.illustration img {
		width: 80%;
		margin-bottom: 50px;
	}

	.hero-text{
		width: 80%;
	}

	@media screen and (max-width:  700px){
		.wrapper{
			width: 100%;
		}
		.hero-text{
			width: 90%;
		}
		.illustration {
			width: 100%;
		}
		.hero-text h1{
			font-size: 1.9rem;
		}
	}

	.hero-text h1{
		color: white;
		font-size: 2.2rem;
		margin-bottom: 20px;
	}

	.hero-text p {
		color: white;
		width: 70%;
		margin: 0 auto;
		margin-bottom: 20px;
	}
	.curvy-bg{
		width: 100%;
		position: absolute;
		/*top: -50%;*/
		bottom: 0;
		z-index: -1;
	}
</style>

<header>
	<div class="wrapper">
		<div class="illustration">
			<img src="images/illustration-intro.png" alt="illustration">
		</div>

		<div class="hero-text">
			<h1>All your files in one secure location, accessible anywhere.</h1>

			<p>Fylo stores all your most important files in one secure location. Access them wherever 
	  		you need, share and collaborate with friends family, and co-workers.</p>
		</div>

		<div class="btn">
			<Button text="Get started" type="button"/>
		</div>
	</div>

	<img class="curvy-bg" src="./images/bg-curvy-{screen}.svg" alt="Curvy image">
</header>