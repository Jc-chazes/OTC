import { BaseMapper } from "./base/base.mapper";
import { User } from "../../models/user.model";
import { getImageUrl } from "../../helpers/images.helper";
import { Image } from "../../models/shared/image.model";

export class UserMapper extends BaseMapper<User>{

    type: new (partial?: Partial<User>) => User = User;

    mapFromBe(be): User{
        let target = new User({...be});
        if(be.photo){
            target.photo = new Image({ fileUrl: be.photo.fileUrl || getImageUrl(be.photo.url) });
        }
        return target
    }
}