import { GraduationCap, Settings } from "lucide-react";

function Header() {
    return (

        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

                <div className="bg-blue-600 p-2 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>

                <div>

                    <h1 className="!m-0 !text-lg !font-semibold !tracking-tight !text-blue-600">
                        University Assistant
                    </h1>

                    <p className="text-xs text-gray-500">
                        AI-powered academic assistant
                    </p>

                </div>

            </div>

            <button
                className="h-9 w-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
            >
                <Settings
                    size={20}
                    className="text-gray-600"
                />
            </button>

        </header>

    );
}

export default Header;
