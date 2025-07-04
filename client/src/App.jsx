import RootLayout from "./components/layout/RootLayout"
import { Toaster } from "react-hot-toast"


function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <RootLayout />
    </>
  )
}

export default App
