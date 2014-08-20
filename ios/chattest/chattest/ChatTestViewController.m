//
//  ChatTestViewController.m
//  chattest
//
//  Created by udntv on 2014/8/19.
//  Copyright (c) 2014年 hsienwei. All rights reserved.
//

#import "ChatTestViewController.h"
#import "SIOSocket.h"

@interface ChatTestViewController ()
{
    __weak IBOutlet UITextField *textField;
    __weak IBOutlet UITextView *chatList;
    SIOSocket *_socket;
}

@end

@implementation ChatTestViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    
}

-(void) viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    [SIOSocket socketWithHost: @"http://localhost:3000" response: ^(SIOSocket *socket)
     {
         _socket = socket;
         
         //[socket on:@"connection" do:^(id data)
         // {
         //     [socket emit: @"chat message", @"ios enter", nil];
         // }];
         _socket.onConnect = ^()
         {
             [_socket emit: @"chatmessage", @"ios enter", nil];
             
             
         };
         
         [_socket on: @"chatmessage" do: ^(id msg)
          {
              /*dispatch_sync(dispatch_get_main_queue(), ^{
                  
               
              });
              */
              [self performSelectorOnMainThread:@selector(fitMsg:) withObject:msg waitUntilDone:YES];
          }];
         
     }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)fitMsg:(id) msg
{
    [chatList setText:[NSString stringWithFormat:@"%@\n%@", msg, chatList.text ]];
}


- (IBAction)clickSend:(id)sender {
    
    if([textField.text characterAtIndex:0] == '@')
    {
        NSString *command =[textField.text substringFromIndex:1];
        NSArray *commands = [command componentsSeparatedByString:@" "];
        [_socket emit:commands[0], commands.count > 1? commands[1]:@"", nil];
    }
    else
    {
        [_socket emit:@"chatmessage", textField.text, nil];
    }
    textField.text = @"";
    [textField resignFirstResponder];
}

@end
