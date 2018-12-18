import { BaseMapper } from "./base/base.mapper";
import { Person } from "../../models/person.model";
import { User } from "../../models/user.model";
import { UserMapper } from "./user.mapper";

export class PersonMapper extends BaseMapper<Person>{

    type: new (partial?: Partial<Person>) => Person = Person;
    userMapper = new UserMapper();

    mapFromBe(be): Person{
        let target = new Person({
            ...be,
            user: this.userMapper.mapFromBe( be.user ),
            birthdate: new Date(be.birthdate)
        });
        return target
    }
}