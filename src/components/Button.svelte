<script>
	export let text = 'Get Started'
	export let type = 'button'
</script>

<style>
	button{
		all:  unset;
		padding: .8em 4em;
		border-radius: 20px;
		background-color: var(--cyan);
		color: white;
		cursor: pointer;
	}

	button:hover{
		background-color: hsla(176, 68%, 64%, 0.5);
	}
</style>

<button type="{type}">{text}</button>