---
layout: ../../layouts/landing.astro
---

<a href="/"><img src="/logo.png" height="220" class="logo"></a><br>

# Request an account

<br>

<form name="request" action="/request/success" method="POST" netlify>
	<div class="form-group">
		<label>Username:<br><input type="text" name="name" class="form-control" required></label>
	</div>
	<br>
	<div class="form-group">
		<label>E-Mail:<br><input type="text" name="email" class="form-control" required></label>
	</div>
	<br>
	<div class="form-group">
		<label>Why do you want to join?<br><textarea name="text" class="form-control" required></textarea></label>
	</div>
	<br><br>
	<input type="submit" class="btn btn-lg btn-primary" id="login" role="button" value="Request account">
</form>

<br><br><br>

[&larr; Back](/start/)

<style>
	label {
		text-align: left;
		line-height: 1.75;
	}
	input,
	textarea {
		width: 300px !important;
	}
	.center {
		text-align: center;
	}
</style>
