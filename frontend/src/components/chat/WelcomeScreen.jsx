function WelcomeScreen() {

    return (

        <div className="h-full flex items-center justify-center">

            <div className="text-center">

                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    👋 Hello!
                </h1>

                <p className="text-lg text-gray-600">
                    I'm your University Assistant
                </p>

                <p className="mt-2 text-gray-500">
                    I can answer questions from your uploaded university documents.
                </p>

            </div>

        </div>

    );

}

export default WelcomeScreen;