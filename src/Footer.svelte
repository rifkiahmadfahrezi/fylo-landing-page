<style>
	footer{
		min-height: 40vh;
		background-color: var(--darkBlue3);
		padding: 20px 25px;
		display: flex;
		flex-direction: column;
		padding-top: 100px;
		max-width: 100vw;
		box-sizing: border-box;
	}

	.logo img{
		width: 150px;
	}

	.footer-content{
		display: grid;
		margin-top: 20px;
		grid-template-columns: repeat(auto-fit, minmax(20%, 1fr));
		justify-items: center;
	}

	@media screen and (max-width: 500px){
		.footer-content{
			align-items: start;
			justify-items: start;
			grid-template-columns: 1fr;
		}
		.box,
		.contact,
		nav{
			margin: 20px 0;
		}
	}

	.box{
		display: flex;
		align-items: flex-start;
		color: white;
	}

	i{
		margin-right: 20px;
	}

	.contact .text{
		color: white;
	}

	.contact .text i {
		margin-right: 20px;
		color: white;
	}

	nav{
		display: flex;
		flex-direction: column;

	}

	nav a{
		color: white;
		margin: 10px 0;
	}
	nav a:first-child{
		margin-top: 0;
	}

	.socmed a{
		color: white;
		font-size: 1.5rem;
	}
</style>
<footer>
	<div class="logo">
		<img src="./images/logo.svg" alt="logo">
	</div>

	<div class="footer-content">

		<div class="address box">
			<i class='bx bxs-map' ></i>
			<div class="text">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro quo iure corporis repellat.
			</div>
		</div>

		<div class="contact">
			<div class="text">
				<i class='bx bxs-phone-call'></i>
				+1-543-123-4567
			</div>

			<div class="text">
				<i class='bx bxs-envelope'></i>
				example@fylo.com
			</div>
		</div>
		
		<nav>
			<a href="#">About Us</a>
			<a href="#">Jobs</a>
			<a href="#">Press</a>
			<a href="#">Blog</a>	
		</nav>

		<nav>
			<a href="#">Contact Us</a>
			<a href="#">Terms</a>
			<a href="#">Privacy</a>	
		</nav>

		<div class="socmed">
			<a href="#"><i class="bx bxl-facebook"></i></a>
			<a href="#"><i class="bx bxl-twitter"></i></a>
			<a href="#"><i class="bx bxl-instagram"></i></a>
		</div>

	</div>
</footer>		