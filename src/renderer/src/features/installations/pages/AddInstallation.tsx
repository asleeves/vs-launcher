import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Input } from "@headlessui/react"
import { useTranslation } from "react-i18next"
import { v4 as uuidv4 } from "uuid"

import { useNotificationsContext } from "@renderer/contexts/NotificationsContext"
import { useConfigContext, CONFIG_ACTIONS } from "@renderer/contexts/ConfigContext"

function AddInslallation(): JSX.Element {
  const { t } = useTranslation()
  const { addNotification } = useNotificationsContext()
  const { config, configDispatch } = useConfigContext()

  const [name, setName] = useState<string>("My New Installation")
  const [folder, setFolder] = useState<string>("")
  const [folderByUser, setFolderByUser] = useState<boolean>(false)
  const [version, setVersion] = useState<GameVersionType>(config.gameVersions[0])

  useEffect(() => {
    ;(async (): Promise<void> => {
      if (name && !folderByUser) setFolder(await window.api.pathsManager.formatPath([await window.api.pathsManager.getCurrentUserDataPath(), "VSLInstallations", name.replace(/[^a-zA-Z0-9]/g, "-")]))
    })()
  }, [name])

  const handleAddInstallation = async (): Promise<void> => {
    if (!name || !folder || !version) return addNotification(t("notifications.titles.warning"), "Please fill all the fields", "warning")

    if (name.length < 5 || name.length > 50) return addNotification(t("notifications.titles.warning"), "Installation name must be between 5 and 50 characters", "warning")

    if (config.installations.some((igv) => igv.path === folder)) return addNotification(t("notifications.titles.error"), "That folder is already used by another installation", "error")

    try {
      const newInstallation: InstallationType = {
        id: uuidv4(),
        name,
        version: version.version,
        path: folder,
        mods: []
      }

      configDispatch({ type: CONFIG_ACTIONS.ADD_INSTALLATION, payload: newInstallation })
      addNotification(t("notifications.titles.success"), "Installation added successfully", "success")
    } catch (error) {
      addNotification(t("notifications.titles.error"), "Error adding installation", "error")
    }
  }

  return (
    <>
      <h1 className="text-3xl text-center font-bold">Add a new installation</h1>

      <div className="mx-auto w-[800px] flex flex-col gap-4 items-start justify-center">
        <div className="w-full flex gap-4">
          <div className="w-48 flex flex-col gap-4 text-right">
            <h3 className="text-lg">Name</h3>
          </div>

          <div className="w-full flex flex-col gap-1">
            <Input
              type="text"
              className={`w-full h-8 px-2 py-1 rounded-md shadow shadow-zinc-900 hover:shadow-none ${name.length < 5 || name.length > 50 ? "border border-red-800 bg-red-800/10" : "bg-zinc-850"}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
              placeholder="My New Installation"
              minLength={5}
              maxLength={50}
            />
            <span className="text-sm text-zinc-500 pl-1">{t("generic.minMaxLength", { min: 5, max: 50 })}</span>
          </div>
        </div>

        <div className="w-full flex gap-4">
          <div className="w-48 flex flex-col gap-4 text-right">
            <h3 className="text-lg">Game version</h3>
          </div>

          <div className="w-full max-h-[250px] bg-zinc-850 rounded overflow-x-hidden shadow shadow-zinc-900 overflow-y-scroll">
            <div className="w-full sticky top-0 bg-zinc-850 flex">
              <div className="w-full text-center p-1">Version</div>
            </div>
            <div className="w-full">
              {config.gameVersions.length < 1 && (
                <div className="w-full p-1 flex items-center justify-center">
                  <span>{t("features.versions.noVersionsFound")}</span>
                </div>
              )}
              {config.gameVersions.map((gv) => (
                <div
                  key={gv.version}
                  onClick={() => setVersion(gv)}
                  className={`flex border-l-4 border-transparent cursor-pointer duration-100 hover:pl-1 ${version?.version === gv.version ? "bg-vs/15 border-vs" : "odd:bg-zinc-800"}`}
                >
                  <div className="w-full p-1">{gv.version}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex gap-4">
          <div className="w-48 flex flex-col gap-4 text-right">
            <h3 className="text-lg">Folder</h3>
          </div>

          <div className="w-full flex gap-2">
            <Button
              onClick={async () => {
                const path = await window.api.utils.selectFolderDialog()
                if (path && path.length > 0) {
                  setFolder(path)
                  setFolderByUser(true)
                }
              }}
              className="w-fit h-8 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded"
            >
              <span className="px-2 py-1">Browse</span>
            </Button>
            <Input
              type="text"
              placeholder="Version folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className={`w-full h-8 px-2 py-1 rounded-md shadow shadow-zinc-900 hover:shadow-none ${folder.length < 1 ? "border border-red-800 bg-red-800/10" : "bg-zinc-850"}`}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center items-center">
        <Button onClick={handleAddInstallation} className="w-fit h-8 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded">
          <span className="px-2 py-1">Add</span>
        </Button>
        <Link to="/installations" title="Cancel" className="w-fit h-8 bg-zinc-850 shadow shadow-zinc-900 hover:shadow-none flex items-center justify-center rounded">
          <span className="px-2 py-1">Go back</span>
        </Link>
      </div>
    </>
  )
}

export default AddInslallation
