<script>
	import Navbar from './Navbar.svelte'
	import Hero from './Hero.svelte'
	import Card from './components/Card.svelte'
	import TestiCard from './components/TestiCard.svelte'
	import ContactCard from './ContactCard.svelte'
	import Footer from './Footer.svelte'
</script>

<style>
	#main{
		background-color: var(--darkBlue1);
		min-height: 20vh;
	}
	.wrapper{
		padding: 20px 25px;
	}
	#card-wrapper{
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		width: 100%;
		place-items: center;
		grid-gap: 20px;
	}

	@media screen and (max-width: 650px){
		#card-wrapper{
			grid-template-columns: repeat(1, 1fr);
		}
		#stay-productive{
			flex-direction: column;
		}

		#stay-productive .img img{
			width: 100%!important;
		}
		#stay-productive .text{
			margin: 20px auto;
			width: 100%!important;
		}
		#stay-productive .img,
		#stay-productive .text{
			width: 90%!important;
			/*object-fit: cover;*/
		}
		#stay-productive .text h2{
			width: 100%!important;
			font-size: 1rem;
		}
		#stay-productive .text{
			margin-left: 0
		}
	}

		@media screen and (max-width: 500px){
			#stay-productive .text{
				margin: 20px auto;
			}
		}

	#stay-productive{
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	#stay-productive .img,
	#stay-productive .text{
		width: 50%;
		/*object-fit: cover;*/
	}
	#stay-productive .img img{
		width: 70%;
		float: right;
	}
	#stay-productive .text{
		margin-left: 20px;
	}
	#stay-productive .text h2{
		color: white;
		font-weight: 700;
		margin-bottom: 10px;
		font-size: 2.4rem;
		width: 60%;
	}
	#stay-productive .text p{
		color: #eee;
		font-weight: 400;
		margin-bottom: 10px;
		font-size: 1rem;
	}
	#stay-productive .text .link{
		color: var(--cyan);
		position: relative;
		padding: 3px 0;
	}

	#stay-productive .text .link::before{
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background-color: var(--cyan);
	}

	#testimonials {
		position: relative;

		/*Grid version*/
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr) );
		place-items: center;
		gap: 20px;

		/*Flexbox version*/
		/*display: flex;
		flex-wrap: wrap;
		gap:  20px;
		justify-content: center;*/
	}
	section{
		margin: 100px auto;
		min-height: 20vh;
	}
	#testimonials::before{
		content: url('../images/bg-quotes.png');
		position: absolute;
		left: -10px;
		top: -30px;
		display: block;
		z-index: 0;
	}

	#contact{
		margin-bottom: 0!important;
		display: flex;
		justify-content: center;
	}
</style>

<Navbar/>
<Hero/>

<main id="main">
	<div class="wrapper">

		<section id="card-wrapper">
			<Card>
				<div slot="img-icon">
					<img src="./images/icon-access-anywhere.svg" alt="icon">
				</div>

				<div slot="card-text">
					<h2>Access your files, anywhere</h2>
					<p>The ability to use a smartphone, tablet, or computer to access your account means your 
  files follow you everywhere.</p>	
				</div>
			</Card>

			<Card>
				<div slot="img-icon">
					<img src="./images/icon-security.svg" alt="icon">
				</div>

				<div slot="card-text">
					<h2>Security you can trust</h2>
					<p>2-factor authentication and user-controlled encryption are just a couple of the security 
  features we allow to help secure your files.</p>	
				</div>
			</Card>

			<Card>
				<div slot="img-icon">
					<img src="./images/icon-collaboration.svg" alt="icon">
				</div>

				<div slot="card-text">
					<h2>Real-time collaboration</h2>
					<p>Securely share files and folders with friends, family and colleagues for live collaboration. 
  No email attachments required.</p>	
				</div>
			</Card>

			<Card>
				<div slot="img-icon">
					<img src="./images/icon-any-file.svg" alt="icon">
				</div>

				<div slot="card-text">
					<h2>Store any type of file</h2>
					<p>Whether you're sharing holidays photos or work documents, Fylo has you covered allowing for all 
  file types to be securely stored and shared.</p>	
				</div>
			</Card>
		</section>

		<section id="stay-productive">
			<div class="img">
				<img src="./images/illustration-stay-productive.png" alt="Illustration image">
			</div>

			<div class="text">
				<h2>Stay productive, wherever you are</h2>
				<p>Never let location be an issue when accessing your files. Fylo has you covered for all of your file storage needs.</p>
				<p>Securely share files and folders with friends, family and colleagues for live collaboration. No email attachments required.</p>

				<a href="#" class="link">See how Fylo works <i class='bx bxs-right-arrow-circle'></i></a>
			</div>

		</section>

		<section id="testimonials">

			<TestiCard>
				<div slot="testi-text">
					Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has become a well-oiled collaboration machine.
				</div>

				<div slot="avatar">
					<img src="./images/profile-1.jpg" width="50" alt="client profile image">
				</div>

				<div slot="client-name">
					Satish Patel
				</div>
				<div slot="client-position">
					Founder & CEO, Huddle
				</div>
			</TestiCard>

			<TestiCard>
				<div slot="testi-text">
					Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has become a well-oiled collaboration machine.
				</div>

				<div slot="avatar">
					<img src="./images/profile-2.jpg" width="50" alt="client profile image">
				</div>

				<div slot="client-name">
					Bruce McKenzie
				</div>
				<div slot="client-position">
					Founder & CEO, Huddle
				</div>
			</TestiCard>

			<TestiCard>
				<div slot="testi-text">
					Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has become a well-oiled collaboration machine.
				</div>

				<div slot="avatar">
					<img src="./images/profile-3.jpg" width="50" alt="client profile image">
				</div>

				<div slot="client-name">
					Iva Boyd
				</div>
				<div slot="client-position">
					Founder & CEO, Huddle
				</div>
			</TestiCard>

		</section>

		<section id="contact">
			<ContactCard/>
		</section>
	</div>
</main>

<Footer/>