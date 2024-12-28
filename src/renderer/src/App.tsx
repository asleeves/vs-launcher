import { useEffect, useState } from "react"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { FiExternalLink } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import "./i18n"

import { ConfigProvider } from "@renderer/contexts/ConfigContext"
import { NotificationsProvider } from "@renderer/contexts/NotificationsContext"
import { PlayingProvider } from "@renderer/contexts/PlayingContext"
import { TaskProvider } from "@renderer/contexts/TaskManagerContext"

import i18n from "./i18n"
import NotificationsOverlay from "@renderer/components/layout/NotificationsOverlay"
import PlayingOverlay from "@renderer/components/layout/PlayingOverlay"

import MainMenu from "@renderer/components/layout/MainMenu"

import HomePage from "@renderer/features/home/pages/HomePage"
import InstallationsPage from "@renderer/features/installations/pages/InstallationsPage"
import VersionsLayout from "@renderer/features/versions/pages/VersionsLayout"
import VersionsList from "@renderer/features/versions/pages/VersionsList"
import AddVersion from "@renderer/features/versions/pages/AddVersion"
import ModsPage from "@renderer/features/mods/pages/ModsPage"

function App(): JSX.Element {
  useEffect(() => {
    const lang = window.localStorage.getItem("lang")
    if (lang) i18n.changeLanguage(lang)
  }, [])

  return (
    <ConfigProvider>
      <NotificationsProvider>
        <PlayingProvider>
          <TaskProvider>
            <Router>
              <div className="relative w-screen h-screen flex">
                <MainMenu />

                <main className="relative w-full h-full">
                  <AppInfo />

                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/installations" element={<InstallationsPage />} />
                    <Route path="/versions" element={<VersionsLayout />}>
                      <Route index element={<VersionsList />} />
                      <Route path="add" element={<AddVersion />} />
                    </Route>
                    <Route path="/mods" element={<ModsPage />} />
                  </Routes>
                </main>

                <NotificationsOverlay />
                <PlayingOverlay />
              </div>
            </Router>
          </TaskProvider>
        </PlayingProvider>
      </NotificationsProvider>
    </ConfigProvider>
  )
}

function AppInfo(): JSX.Element {
  const { t } = useTranslation()

  const [version, setVersion] = useState("")

  useEffect(() => {
    ;(async (): Promise<void> => {
      const res = await window.api.utils.getAppVersion()
      setVersion(res)
    })()
  }, [])

  return (
    <div className="w-full absolute z-[100] p-1 px-4 select-none bg-gradient-to-b from-zinc-950/60 to-zinc-950/0 flex justify-between items-center text-xs text-zinc-500">
      <span className="flex flex-nowrap gap-1">
        <MiniLinks to="https://github.com/XurxoMF/vs-launcher/issues" text={t("generic.issues")} />|
        <MiniLinks to="https://github.com/XurxoMF/vs-launcher/wiki" text={t("generic.guides")} />|
        <MiniLinks to="https://github.com/XurxoMF/vs-launcher" text={t("generic.source")} />
      </span>
      <span>VS Launcher - v{version}</span>
    </div>
  )
}

function MiniLinks({ to, text }: { to: string; text: string }): JSX.Element {
  return (
    <a onClick={() => window.api.utils.openOnBrowser(to)} className="flex flex-row flex-nowrap items-center gap-1 cursor-pointer">
      {text} <FiExternalLink />
    </a>
  )
}

export default App
