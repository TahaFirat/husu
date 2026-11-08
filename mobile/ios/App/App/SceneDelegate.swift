import UIKit
import Capacitor

final class HusuViewController: CAPBridgeViewController, UIScrollViewDelegate {
    override func viewDidLoad() {
        super.viewDidLoad()
        let nightTeal = UIColor(red: 8.0 / 255.0, green: 15.0 / 255.0, blue: 18.0 / 255.0, alpha: 1.0)
        view.backgroundColor = nightTeal
        webView?.isOpaque = false
        webView?.backgroundColor = nightTeal
        webView?.scrollView.backgroundColor = nightTeal
        webView?.scrollView.bounces = true
        webView?.scrollView.alwaysBounceVertical = true
        webView?.scrollView.alwaysBounceHorizontal = false
        webView?.scrollView.minimumZoomScale = 1.0
        webView?.scrollView.maximumZoomScale = 1.0
        webView?.scrollView.bouncesZoom = false
        webView?.scrollView.delegate = self
        webView?.allowsBackForwardNavigationGestures = true
    }

    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
        return nil
    }
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let rootWindow = UIWindow(windowScene: windowScene)
        rootWindow.backgroundColor = UIColor(red: 8.0 / 255.0, green: 15.0 / 255.0, blue: 18.0 / 255.0, alpha: 1.0)
        rootWindow.rootViewController = HusuViewController()
        rootWindow.makeKeyAndVisible()
        window = rootWindow

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}
