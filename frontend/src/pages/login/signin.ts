export class SigninPage {
    render(): string {
        return `
            <div class="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow text-center">Sign In</h2>
                
                <form id="signin-form" class="space-y-6">
                    <div>
                        <label class="block text-neon-purple mb-1" for="login">Login</label>
                        <input type="text" id="login" name="login" required
                            class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                    </div>
                    <div>
                        <label class="block text-neon-purple mb-1" for="password">Password</label>
                        <input type="password" id="password" name="password" required
                            class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                    </div>
                    <button type="submit"
                        class="w-full mt-4 py-2 bg-neon-purple hover:bg-neon-green transition text-white font-semibold rounded-lg shadow">
                        signin
                    </button>
                </form>

                <div class="text-center my-4 text-gray-400">OR</div>

                <div class="text-center">
                    <a href="http://localhost:3000/auth/google">
                        <button class="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white text-gray-800 rounded-lg shadow hover:shadow-lg transition">
                            <img src="./public/images/google-logo.png" alt="Google" class="w-5 h-5">
                            <span class="text-white">Sign in with Google</span>
                        </button>
                    </a>
                </div>
            </div>
        `;
    }
}
