export class SignupPage {
    render(): string {
        return `
            <div class="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">Sign Up</h2>
                <form id="signup-form" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-neon-purple mb-1" for="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div>
                            <label class="block text-neon-purple mb-1" for="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div>
                            <label class="block text-neon-purple mb-1" for="idNumber">ID</label>
                            <input type="text" id="idNumber" name="idNumber" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div>
                            <label class="block text-neon-purple mb-1" for="nickname">Nickname</label>
                            <input type="text" id="nickname" name="nickname" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-neon-purple mb-1" for="email">Email Address</label>
                            <input type="email" id="email" name="email" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-neon-purple mb-1" for="password">Password</label>
                            <input type="password" id="password" name="password" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-neon-green mb-1" for="postalAddress">Postal Address <span class="text-gray-400 text-sm">(optional)</span></label>
                            <input type="text" id="postalAddress" name="postalAddress"
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-neon-green mb-1" for="phoneNumber">Phone Number <span class="text-gray-400 text-sm">(optional)</span></label>
                            <input type="tel" id="phoneNumber" name="phoneNumber"
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                    </div>
                    <button type="submit"
                        class="w-full mt-4 py-2 bg-neon-purple hover:bg-neon-green transition text-white font-semibold rounded-lg shadow">
                        Create Account
                    </button>
                </form>
            </div>
        `;
    }
}
