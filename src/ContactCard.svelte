<script>
	import Button from './components/Button.svelte'
	let email = ''
	let error = ''



	function checkEmail(email)
	{	
		if(email == ''){
			error = 'Please input your email'
		}
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

		if(emailPattern.test(email) == false){
			error = 'Please enter a valid email'
		}else{
			alert('success')
			error = ''
		}
	}

	function handleSubmit() {
		event.preventDefault()
		checkEmail(email)
	}

</script>
<style>
	.input{
		display: flex;
		gap: 20px;
		width: 100%;
		max-height: 50px;
	}
	.error-message{
		color: var(--red);
		display: block;
	}
	.wrapper{
		padding: 20px;
		background-color: var(--darkBlue2);
		border-radius: 6px;
		max-width: 800px;
		width: 100%;
		margin-bottom: -100px;
	}

	.text-wrapper{
		color: white;
		text-align: center;
		padding: 20px 0;
		max-width: 400px;
		margin: 0  auto;
	}
	.text-wrapper h2{
		font-size: 1.7rem;
		margin-bottom: 10px;
		font-weight: 700;
	}
	.form-email{
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		max-width: 600px;
		margin: 30px auto;
		gap: 10px;
		flex-direction: column;

	}
	.form-email input{
		padding: 10px 8px;
		border-radius: 20px;
		width: 90%;
	}
	@media screen and (max-width: 500px){
		.form-email{
			flex-direction: column;
		}
		/*.form-email input{
			width: 100%;
		}*/
		.input{
			flex-direction: column;
			margin: 0 auto;
			padding-bottom: 30px;
			text-align: center;
		}
		.error-message{
			margin-top: 20px
		}
	}
</style>
<div class="wrapper">
	<div class="text-wrapper">
		<h2>Get early access today</h2>
		<p>It only takes a minute to sign up and our free starter tier is extremely generous. If you have any questions, our support team would be happy to help you.</p>
	</div>

	<form method="post" class="form-email" on:submit={handleSubmit}>
		<div class="input">
			<input type="email" bind:value={email} required placeholder="email@example.com">
			<Button type="submit" text="Get Started For Free"/>
		</div>
		<p class="error-message">{error}</p>
	</form>
</div>