import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import {RichTextEditorComponent} from "~/components/rich-text-editor/rich-text-editor.component";



const routes: Routes = [
    { path: "", redirectTo: "/rich-text-editor", pathMatch: "full" },
    { path: "rich-text-editor", component: RichTextEditorComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }