<style>
	.card-wrapper{
		padding: 20px;
		border-radius: 5px;
		background-color: var(--darkBlue4);
		max-width: 400px;
		z-index: 1;
	}

	.card-text{
		color: white;
		text-align: left;
		margin-bottom: 20px;
		font-size: .9rem;
	}

	.card-footer {
		display: flex;
		align-items: center;
	}

	.avatar{
		width: 50px;
		height: 50px;
		overflow: hidden;
		margin-right: 10px;
		border-radius: 50%;
		object-position: center	;
	}


	.client-info h4{
		color: white;
		font-weight: 600;
		font-size: 1.1rem;
	}
	.client-info small{
		color: white;
		font-weight: 200;
	}

</style>

<div class="card-wrapper">
	<div class="card-body">
		<div class="card-text">
			<slot name="testi-text">
				<!-- Testi text here -->
			</slot>
		</div>

		<div class="card-footer">
			<div class="avatar">
				<slot name="avatar">
					<!-- Client image -->
				</slot>
			</div>

			<div class="client-info">
				<h4>
					<slot name="client-name">
						<!-- client name -->
					</slot>
				</h4>
				<small>
					<slot name="client-position">
						<!-- Client position -->
					</slot>
				</small>
			</div>
		</div>
	</div>
</div>