import {PostStub} from "../../../stub/PostStub";
import {toUpdatePost} from "../../../../shared/utils/post/post.utils";
import {IPost, UpdatePost} from "../../../../shared/types/post.type";

describe('PostUtils', function () {

    it('should convert post data to the update post object', function () {

        const post = PostStub();

        let result: IPost | UpdatePost = post;

        expect(Object.keys(result)).toContain("slug");

        result = toUpdatePost(post);

        expect(Object.keys(result)).not.toContain("slug");

    });

});