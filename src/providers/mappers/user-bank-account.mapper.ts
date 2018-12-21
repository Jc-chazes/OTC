import { BaseMapper } from "./base/base.mapper";
import { UserBankAccount } from "../../models/user-bank-account.model";
import { Bank } from "../../models/bank.model";
import { getImageUrl } from "../../helpers/images.helper";
import { Image } from "../../models/shared/image.model";
import { capitalize } from 'lodash';

export class UserBankAccountMapper extends BaseMapper<UserBankAccount>{

    type: new (partial?: Partial<UserBankAccount>) => UserBankAccount = UserBankAccount;

    mapFromBe(be): UserBankAccount{
        return new UserBankAccount({
            ...be,
            accountNumber: be.accountNumber || be.account_number,
            accountType: be.accountType || be.account_type,
            bank: new Bank({
                ...be.bank,
                image: new Image({
                    fileUrl: getImageUrl(be.bank.image.url)
                }),
            })
        });
    }

}