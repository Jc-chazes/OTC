import { NavController, ViewController } from "ionic-angular";

export const popToIndex = (navController: NavController, viewController: ViewController,index:number) => {
    const parentIndex = viewController.index;
    for(let i = parentIndex; i > index; i--){
        navController.remove(i);
    }
}