<style>
	.card{
		text-align: center;
		max-width: 400px;
		margin-top: 20px;
	}

	@media screen and (max-width: 500px){
		.card{
			margin: 50px auto;
		}
	}

	:global(.card-text h2){
		color: white;
		margin: 10px auto;
	}
	:global(.card-text p){
		color: #eee;
	}

</style>
<div class="card">
	<div class="img-icon">
		<slot name="img-icon">
			<!-- Image icon here -->
			<!-- Use img tag -->
		</slot>
	</div>

	<div class="card-text">
		<slot name="card-text">
			<!-- Card Text here -->
			<!-- Use h2 for heading -->
			<!-- Use p for text -->
		</slot>
	</div>
</div>