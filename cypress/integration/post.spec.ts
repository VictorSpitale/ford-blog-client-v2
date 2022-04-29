import {IPost} from "../../shared/types/post.type";

context('Post Page', () => {

    const apiUrl = Cypress.env('apiUrl');
    let post;

    beforeEach(() => {
        cy.fixture('lastPosts').as('posts').then(res => {
            post = res[0]
        });
        cy.fixture('user').as('user');
    })

    before(() => {
        cy.fixture('lastPosts').as('posts').then(res => {
            cy.visit(`http://localhost:3000/post/${res[0].slug}`, {

                onBeforeLoad(win: Cypress.AUTWindow) {
                    let nextData: any;
                    Object.defineProperty(win, '__NEXT_DATA__', {
                        set(o: any) {
                            o.props.pageProps.initialState.post.post = res[0];
                            o.props.pageProps.initialProps = {};
                            nextData = o;
                        },
                        get() {
                            return nextData
                        }
                    })
                }
            })
        })
    })

    it('should display the post (unauth)', () => {
        cy.get('@posts').then((res: unknown | IPost[]) => {
            cy.get('h1').contains(res[0].title)
            cy.get('main img').should('have.attr', 'alt', res[0].title);
            cy.get('.LikeBtn_box__wW7Kr')
            cy.get('main a').should('have.attr', 'href', res[0].sourceLink)
        })
    })

    it('should not display admin actions', () => {
        cy.get('.mt-4 > :nth-child(2) > :nth-child(1)').should('not.exist');
        cy.get('.mt-4 > :nth-child(2) > :nth-child(2)').should('not.exist');
    })

    it('should display the post (auth) and liked', () => {
        cy.fixture('lastPosts').as('posts').then(res => {
            cy.fixture('user').as('user').then(user => {
                cy.visit(`http://localhost:3000/post/${res[0].slug}`, {
                    onBeforeLoad(win: Cypress.AUTWindow) {
                        let nextData: any;
                        Object.defineProperty(win, '__NEXT_DATA__', {
                            set(o: any) {
                                const post = res[0];
                                o.props.pageProps.initialState.post.post = {
                                    ...post,
                                    likes: 1,
                                    authUserLiked: true
                                };
                                o.props.pageProps.initialState.user.user = user;
                                o.props.pageProps.initialProps = {};
                                nextData = o;
                            },
                            get() {
                                return nextData
                            }
                        })
                    }
                })
            })
        })
        cy.get('.LikeBtn_box__wW7Kr').as('heart').then(res => {
            expect(res.siblings('p').contents().text()).to.contains('1');
        })
    })

    it('should display admin actions', () => {
        cy.get('.mt-4 > :nth-child(2) > :nth-child(1)');
        cy.get('.mt-4 > :nth-child(2) > :nth-child(2)');
    })

    it('should remove the like', () => {
        cy.intercept({
            method: "PATCH",
            url: `${apiUrl}/posts/unlike/${post.slug}`,
        }, {statusCode: 200, body: 0}).as('unlike')
        cy.get('.LikeBtn_active__lA2IS').should('be.visible')
        cy.get('.LikeBtn_box__wW7Kr').click();
        cy.wait(1000);
        cy.get('.LikeBtn_box__wW7Kr').as('heart').then(res => {
            expect(res.siblings('p').contents().text()).to.contains('0');
            cy.get('.LikeBtn_heart__Bwsbz')
        })
    })
    it('should like the post', () => {
        cy.intercept({
            method: "PATCH",
            url: `${apiUrl}/posts/like/${post.slug}`,
        }, {statusCode: 200, body: 1}).as('unlike')
        cy.get('.LikeBtn_box__wW7Kr').click();
        cy.wait(1000);
        cy.get('.LikeBtn_box__wW7Kr').as('heart').then(res => {
            expect(res.siblings('p').contents().text()).to.contains('1');
            cy.get('.LikeBtn_active__lA2IS').should('be.visible')
        })
    })

    it('should display its category, only the first 3', () => {
        for (let i = 0; i < post.categories.length; i++) {
            if (i < 3) {
                cy.get(`#${post.categories[i].name}`).should('exist');
            } else {
                cy.get(`#${post.categories[i].name}`).should('not.exist');
            }
        }
    })

    it('should open the update modal', () => {
        cy.get('.mt-4 > :nth-child(2) > :nth-child(2)').click();
        cy.get('.Modal_modal__yDLSi');
    })

    const newTitle = "le nouveau titre"
    it('should update the post', () => {

        cy.intercept({
            method: "PATCH",
            url: `${apiUrl}/posts/${post.slug}`,
        }, {
            statusCode: 200, body: {
                ...post,
                title: newTitle
            }
        }).as('unlike')

        cy.get('#title').clear().type(newTitle);
        cy.get('.Modal_modal__yDLSi .separate_child button:first-of-type').click();
        cy.get('h1').contains(newTitle)
    })

    it('should open the delete modal', () => {
        cy.get('.mt-4 > :nth-child(2) > :nth-child(1)').click();
        cy.get('.Modal_modal__yDLSi').contains(newTitle);
    })

    it('should close the delete modal', () => {
        cy.get('.Modal_modal__yDLSi button').then(res => {
            res[2].click();
        })
        cy.get('.Modal_modal__yDLSi').should('not.exist')
    })

    it('should delete a post', () => {
        cy.get('.mt-4 > :nth-child(2) > :nth-child(1)').click();
        cy.get('.Modal_modal__yDLSi button').then(res => {
            res[1].click();
        })
        cy.intercept({
            method: "DELETE",
            path: `/api/posts/${post.slug}`,
        }, {statusCode: 200});
        cy.location('pathname').should('eq', '/')
    })

})