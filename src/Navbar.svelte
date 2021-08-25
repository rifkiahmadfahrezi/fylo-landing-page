<script>
	let src = `images/logo.svg`
</script>

<style>
	nav{
		background-color: var(--darkBlue2);
		display: flex;
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		top: 0;
		justify-content: space-between;
		align-items: center;
		z-index: 999;
		padding: 20px 25px;
	}
	.logo img {
		width: 100px;
	}

	.navbar-menu{
		display: flex;
		width: 25%;
		justify-content: space-between;
	}

	@media screen and (max-width: 700px) {
		.navbar-menu{
			width: 50%
		}
	}

	.nav-link{
		color: #eee;
	}

	.nav-link:hover{
		color: white;
		text-decoration: underline;
	}
</style>

<nav>
	<div class="logo">
		<img {src} alt="Logo">
	</div>

	<div class="navbar-menu">
		<a href="#" class="nav-link">Features</a>
		<a href="#" class="nav-link">Team</a>
		<a href="#" class="nav-link">Sign In</a>
	</div>
</nav>