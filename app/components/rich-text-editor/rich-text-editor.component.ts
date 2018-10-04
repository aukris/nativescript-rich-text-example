import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {WebViewInterface} from 'nativescript-webview-interface';
import {LoadEventData, WebView} from 'tns-core-modules/ui/web-view';
import * as dialogs from "ui/dialogs";
import {NativeToJSEventData} from "~/utils";

@Component({
    moduleId: __filename,
    selector: "rich-text-editor",
    templateUrl: "rich-text-editor.component.html",
    styleUrls: ["rich-text-editor.component.scss"],
})

export class RichTextEditorComponent implements OnInit { 
    keyBoardHeight = 0;
    oWebViewInterface:any;
    @ViewChild('webView') webView: ElementRef;
    constructor( private changeDetectorRef: ChangeDetectorRef) {}
    ngOnInit() {
        this.initWebView();
    }

    linkInputPrompt() {
        // Second argument is optional.
        dialogs.prompt({title: 'Add Link', message: 'Please enter a valid web link',
        okButtonText: "Add", defaultText:'https://www.youtube.com/watch?v=cWGE9Gi0bB0',
        cancelButtonText: "Cancel"}).then(r => {
            console.log("Dialog result: " + r.result + ", text: " + r.text);
            if(r.result) {
                this.oWebViewInterface.emit('javaScriptEvent',new NativeToJSEventData(1, r.text));
            }
        });
    }

    videoLinkInputPrompt() {
        dialogs.prompt({title: 'Add Video', message: 'Previews are supported for youtube and vimeo',
        okButtonText: "Add", defaultText:'https://www.youtube.com/watch?v=cWGE9Gi0bB0',
        cancelButtonText: "Cancel"}).then(r => {
            console.log("Dialog result: " + r.result + ", text: " + r.text);
               if(r.result) {
                this.oWebViewInterface.emit('javaScriptEvent',new NativeToJSEventData(3, r.text));
            }
        });
    }

    pickImage() {
        console.log('No implementation for image picker');
    }

    initWebView() {
        let webViewSrc = '~/assets/tapchief-rich-text.html';
        let webviewN = this.webView.nativeElement;
        this.oWebViewInterface = new WebViewInterface(this.webView.nativeElement, webViewSrc);
        webviewN.on(WebView.loadStartedEvent, function (args: LoadEventData) {
            if (webviewN.android) {
                webviewN.android.setBackgroundColor(0x00000000);
                webviewN.android.getSettings().setBuiltInZoomControls(false);
                webviewN.android.setScrollContainer(false);

             } else {
                webviewN.ios.configuration.preferences.javaScriptEnabled = true;
                webviewN.ios.scrollView.minimumZoomScale = 1.0;
                webviewN.ios.scrollView.maximumZoomScale = 1.0;
                webviewN.ios.scalesPageToFit = true;

            }
        });

        webviewN.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
        if (!args.error) {
            this.setContent(`<blockquote>Collaborate with Experts for Consultations, Projects, Workshops, Training &amp; more, on-demand only on <b style="font-style: normal;">TapChief</b></blockquote><br>`);


            this.oWebViewInterface.on('nativeScriptEvent', (event)=>{
                let mode = event.mode;
                if (mode == 1) {
                    this.linkInputPrompt()
                } else if (mode == 2){
                    // this.pickImage();
                } else if (mode ==3) {
                    this.videoLinkInputPrompt();
                } else {
                     console.dir(event.data);
                }
                console.dir(event);
            })
        } else {
            console.log('error');
            console.dir(args.error)
        }

        });
    }

    setContent(content) {
        this.oWebViewInterface.emit('javaScriptEvent',new NativeToJSEventData(4, content));
    }

    getContent() {
        this.oWebViewInterface.callJSFunction('getContent', [],(r)=>{console.log(r)})
    }

  ngOnDestroy(){
        this.changeDetectorRef.detach();
  }
}
